import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AdminOlympiadStageForm: React.FC = () => {
  const { id, stageId } = useParams<{ id: string; stageId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage_type: 'test',
    start_time: '',
    end_time: '',
    duration_minutes: 60,
    max_score: 100,
    order_index: 0
  });

  useEffect(() => {
    if (stageId && stageId !== 'new') {
      fetchStage();
    } else {
      // Для нового этапа получим следующий order_index
      fetchNextOrderIndex();
    }
  }, [stageId]);

  const fetchNextOrderIndex = async () => {
    const { data } = await supabase
      .from('olympiad_stages')
      .select('order_index')
      .eq('olympiad_id', id)
      .order('order_index', { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      setFormData(prev => ({ ...prev, order_index: data[0].order_index + 1 }));
    }
  };

  const fetchStage = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('olympiad_stages')
      .select('*')
      .eq('id', stageId)
      .single();
    if (error) console.error(error);
    else if (data) {
      setFormData({
        title: data.title,
        description: data.description || '',
        stage_type: data.stage_type,
        start_time: data.start_time ? data.start_time.slice(0, 16) : '',
        end_time: data.end_time ? data.end_time.slice(0, 16) : '',
        duration_minutes: data.duration_minutes || 60,
        max_score: data.max_score || 100,
        order_index: data.order_index
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      olympiad_id: id,
      ...formData,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      duration_minutes: parseInt(formData.duration_minutes as any),
      max_score: parseInt(formData.max_score as any),
      order_index: parseInt(formData.order_index as any)
    };

    let error;
    if (stageId && stageId !== 'new') {
      ({ error } = await supabase.from('olympiad_stages').update(payload).eq('id', stageId));
    } else {
      ({ error } = await supabase.from('olympiad_stages').insert([payload]));
    }

    if (error) {
      alert('Ошибка сохранения: ' + error.message);
    } else {
      navigate(`/admin/olympiads/${id}/stages`);
    }
    setLoading(false);
  };

  if (loading && stageId !== 'new') return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(`/admin/olympiads/${id}/stages`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        К этапам
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {stageId && stageId !== 'new' ? 'Редактирование этапа' : 'Новый этап'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип этапа</label>
            <select
              name="stage_type"
              value={formData.stage_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="test">Тест</option>
              <option value="file_upload">Загрузка файла</option>
              <option value="offline">Очный этап</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начало этапа</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Окончание этапа</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (мин)</label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Макс. баллов</label>
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядковый номер</label>
            <input
              type="number"
              name="order_index"
              value={formData.order_index}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/olympiads/${id}/stages`)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save size={18} />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOlympiadStageForm;
