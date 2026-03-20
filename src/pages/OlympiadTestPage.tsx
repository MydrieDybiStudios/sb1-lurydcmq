import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import OlympiadTest from '../components/OlympiadTest';
import { generateOlympiadDiploma } from '../utils/diplomaGenerator';
import { getPlace } from '../utils/olympiadHelpers';
import { Olympiad, OlympiadStage, OlympiadTask } from '../types/olympiad';

const OlympiadTestPage: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<OlympiadStage | null>(null);
  const [tasks, setTasks] = useState<OlympiadTask[]>([]);
  const [olympiad, setOlympiad] = useState<Olympiad | null>(null);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchData();
  }, [stageId]);

  const fetchData = async () => {
    setLoading(true);
    const { data: stageData } = await supabase
      .from('olympiad_stages')
      .select('*')
      .eq('id', stageId)
      .single();
    setStage(stageData);

    if (stageData) {
      const { data: tasksData } = await supabase
        .from('olympiad_tasks')
        .select('*')
        .eq('stage_id', stageData.id)
        .order('order_index');
      setTasks(tasksData || []);

      const { data: olympiadData } = await supabase
        .from('olympiads')
        .select('*')
        .eq('id', stageData.olympiad_id)
        .single();
      setOlympiad(olympiadData);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        setUserName(profile ? `${profile.first_name} ${profile.last_name}`.trim() : user.email || 'Участник');

        const { data: regData } = await supabase
          .from('olympiad_registrations')
          .select('id')
          .eq('olympiad_id', stageData.olympiad_id)
          .eq('user_id', user.id)
          .single();
        if (regData) {
          setRegistrationId(regData.id);

          const { data: attemptData } = await supabase
            .from('olympiad_attempts')
            .select('id')
            .eq('registration_id', regData.id)
            .eq('stage_id', stageData.id)
            .maybeSingle();

          if (attemptData) {
            setAttemptId(attemptData.id);
          } else {
            const { data: newAttempt, error } = await supabase
              .from('olympiad_attempts')
              .insert({
                registration_id: regData.id,
                stage_id: stageData.id,
                started_at: new Date().toISOString(),
                status: 'started'
              })
              .select()
              .single();
            if (!error) setAttemptId(newAttempt.id);
          }
        }
      }
    }
    setLoading(false);
  };

  const handleTestComplete = async (answers: any[], score: number) => {
    if (!attemptId || !registrationId || !stage || !olympiad) return;

    await supabase
      .from('olympiad_attempts')
      .update({
        submitted_at: new Date().toISOString(),
        score,
        data: answers,
        status: 'submitted'
      })
      .eq('id', attemptId);

    const { count: totalStages } = await supabase
      .from('olympiad_stages')
      .select('*', { count: 'exact', head: true })
      .eq('olympiad_id', olympiad.id);

    const { data: attempts, error: attemptsError } = await supabase
      .from('olympiad_attempts')
      .select('*')
      .eq('registration_id', registrationId)
      .eq('status', 'submitted');

    if (!attemptsError && attempts.length === totalStages) {
      const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
      const { data: stages } = await supabase
        .from('olympiad_stages')
        .select('max_score')
        .eq('olympiad_id', olympiad.id);
      const maxPossible = stages?.reduce((sum, s) => sum + (s.max_score || 0), 0) || 0;
      const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

      const place = getPlace(percentage, olympiad);

      const pdfBytes = await generateOlympiadDiploma(
        userName,
        olympiad.title,
        place,
        percentage,
        totalScore,
        maxPossible,
        olympiad.diploma_text || undefined
      );

      const fileName = `diploma_${registrationId}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('diplomas')
        .upload(fileName, pdfBytes, { contentType: 'application/pdf', upsert: true });

      let diplomaUrl = null;
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('diplomas').getPublicUrl(fileName);
        diplomaUrl = urlData.publicUrl;
      }

      await supabase
        .from('olympiad_registrations')
        .update({
          final_score: totalScore,
          place,
          diploma_url: diplomaUrl,
          status: 'completed'
        })
        .eq('id', registrationId);

      if (diplomaUrl) {
        window.open(diplomaUrl, '_blank');
      }
    }

    navigate(`/olympiads/${olympiad.id}`);
  };

  const handleTimeOut = () => {
    alert('Время вышло!');
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!stage || !tasks.length) return <div>Тест не найден</div>;

  const questions = tasks.map(t => ({
    id: t.id,
    question: t.question || '',
    options: t.options || [],
    correctAnswer: t.correct_answer || '',
    maxScore: t.max_score || 1
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">{stage.title}</h1>
        <p className="text-gray-300 mb-6">{stage.description}</p>
        <OlympiadTest
          questions={questions}
          durationMinutes={stage.duration_minutes || 0}
          onComplete={handleTestComplete}
          onTimeOut={handleTimeOut}
        />
      </div>
    </div>
  );
};

export default OlympiadTestPage;
