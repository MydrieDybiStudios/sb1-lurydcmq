import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { OlympiadStage } from '../../types/olympiad';

const AdminOlympiadStages: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [olympiadTitle, setOlympiadTitle] = useState('');
  const [stages, setStages] = useState<OlympiadStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOlympiad();
    fetchStages();
  }, [id]);

  const fetchOlympiad = async () => {
    const { data } = await supabase.from('olympiads').select('title').eq('id', id).single();
    if (data) setOlympiadTitle(data.title);
  };

  const fetchStages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('olympiad_stages')
      .select('*')
      .eq('olympiad_id', id)
      .order('order_index', { ascending: true });
    setStages(data || []);
    setLoading(false);
  };

  const handleDeleteStage = async (stageId: number) => {
    if (!confirm('Удалить этап? Все задания будут удалены.')) return;
    await supabase.from('olympiad_stages').delete().eq('id', stageId);
    fetchStages();
  };

  const moveStage = async (stageId: number, direction: 'up' | 'down') => {
    const index = stages.findIndex(s => s.id === stageId);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stages.length - 1) return;

    const newStages = [...stages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index].order_index, newStages[swapIndex].order_index] = 
      [newStages[swapIndex].order_index, newStages[index].order_index];

    await supabase.from('olympiad_stages').upsert([
      { id: newStages[index].id, order_index: newStages[index].order_index },
      { id: newStages[swapIndex].id, order_index: newStages[swapIndex].order_index }
    ]);

    fetchStages();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate('/admin/olympiads')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        К списку олимпиад
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Этапы олимпиады: {olympiadTitle}</h1>
        <button
          onClick={() => navigate(`/admin/olympiads/${id}/stages/new`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Добавить этап
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStage(stage.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    onClick={() => moveStage(stage.id, 'down')}
                    disabled={idx === stages.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold">{stage.title}</h3>
                  <p className="text-sm text-gray-500">
                    Тип: {stage.stage_type === 'test' ? 'Тест' : stage.stage_type} | 
                    Баллов: {stage.max_score || 'не указано'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/olympiads/stages/${stage.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Редактировать этап"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => navigate(`/admin/olympiads/stages/${stage.id}/tasks`)}
                  className="text-green-600 hover:text-green-800"
                  title="Задания"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleDeleteStage(stage.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Удалить этап"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {stages.length === 0 && (
            <div className="text-center py-12 text-gray-500">Этапов пока нет</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOlympiadStages;
