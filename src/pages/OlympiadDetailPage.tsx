import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Award, CheckCircle } from 'lucide-react';
import { Olympiad, OlympiadStage } from '../types/olympiad';

const OlympiadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [olympiad, setOlympiad] = useState<Olympiad | null>(null);
  const [stages, setStages] = useState<OlympiadStage[]>([]);
  const [registered, setRegistered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<{ [stageId: number]: boolean }>({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const { data: olympiadData } = await supabase
      .from('olympiads')
      .select('*')
      .eq('id', id)
      .single();
    setOlympiad(olympiadData);

    if (olympiadData) {
      const { data: stagesData } = await supabase
        .from('olympiad_stages')
        .select('*')
        .eq('olympiad_id', id)
        .order('order_index', { ascending: true });
      setStages(stagesData || []);
    }

    const { data: userData } = await supabase.auth.getUser();
    setUser(userData?.user || null);

    if (userData?.user && olympiadData) {
      const { data: regData } = await supabase
        .from('olympiad_registrations')
        .select('id')
        .eq('olympiad_id', id)
        .eq('user_id', userData.user.id)
        .maybeSingle();
      setRegistered(!!regData);

      if (regData) {
        const { data: attemptsData } = await supabase
          .from('olympiad_attempts')
          .select('stage_id, status')
          .eq('registration_id', regData.id);
        const attemptsMap: { [key: number]: boolean } = {};
        attemptsData?.forEach(a => {
          attemptsMap[a.stage_id] = a.status === 'submitted' || a.status === 'graded';
        });
        setAttempts(attemptsMap);
      }
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/?login');
      return;
    }
    const { error } = await supabase
      .from('olympiad_registrations')
      .insert({ olympiad_id: id, user_id: user.id });
    if (error) {
      alert('Ошибка регистрации: ' + error.message);
    } else {
      setRegistered(true);
    }
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!olympiad) return <div className="text-center py-12">Олимпиада не найдена</div>;

  const now = new Date();
  const regStart = olympiad.registration_start ? new Date(olympiad.registration_start) : null;
  const regEnd = olympiad.registration_end ? new Date(olympiad.registration_end) : null;
  const canRegister = regStart && regEnd && now >= regStart && now <= regEnd;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/olympiads')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          <ArrowLeft size={20} />
          К списку олимпиад
        </button>

        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">{olympiad.title}</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-3">
              <Calendar className="text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Регистрация</div>
                <div>
                  {olympiad.registration_start
                    ? new Date(olympiad.registration_start).toLocaleDateString()
                    : 'не указано'}
                  {' - '}
                  {olympiad.registration_end
                    ? new Date(olympiad.registration_end).toLocaleDateString()
                    : 'не указано'}
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-3">
              <Award className="text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Этапов</div>
                <div>{stages.length}</div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-3">
              <Clock className="text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Статус</div>
                <div>
                  {olympiad.status === 'published' && 'Опубликована'}
                  {olympiad.status === 'ongoing' && 'Идёт'}
                  {olympiad.status === 'finished' && 'Завершена'}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-8 whitespace-pre-line">{olympiad.description}</p>

          {!registered ? (
            <button
              onClick={handleRegister}
              disabled={!canRegister}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition"
            >
              {canRegister ? 'Зарегистрироваться' : 'Регистрация закрыта'}
            </button>
          ) : (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-400" />
              <span>Вы зарегистрированы! Следите за этапами.</span>
            </div>
          )}

          {stages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Этапы олимпиады</h2>
              <div className="space-y-4">
                {stages.map((stage, idx) => {
                  const stageCompleted = attempts[stage.id];
                  const stageNow = new Date();
                  const stageStart = stage.start_time ? new Date(stage.start_time) : null;
                  const stageEnd = stage.end_time ? new Date(stage.end_time) : null;
                  const isActive = stageStart && stageEnd && stageNow >= stageStart && stageNow <= stageEnd;

                  return (
                    <div key={stage.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{idx + 1}. {stage.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{stage.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>Тип: {stage.stage_type === 'test' ? 'Тест' : stage.stage_type === 'file_upload' ? 'Загрузка файла' : 'Очный этап'}</span>
                            {stage.max_score && <span>Макс. баллов: {stage.max_score}</span>}
                          </div>
                        </div>
                        {registered && stage.stage_type === 'test' && !stageCompleted && isActive && (
                          <button
                            onClick={() => navigate(`/olympiads/test/${stage.id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm"
                          >
                            Начать тест
                          </button>
                        )}
                        {registered && stageCompleted && (
                          <span className="text-green-400 text-sm">✓ Выполнено</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OlympiadDetailPage;
