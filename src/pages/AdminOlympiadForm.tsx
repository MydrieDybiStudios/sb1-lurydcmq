import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AdminOlympiadForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    registration_start: '',
    registration_end: '',
    status: 'draft',
    first_place_percent: 90,
    second_place_percent: 75,
    third_place_percent: 60,
    diploma_text: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchOlympiad();
    }
  }, [id]);

  const fetchOlympiad = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('olympiads')
      .select('*')
      .eq('id', id)
      .single();
    if (error) console.error(error);
    else if (data) {
      setFormData({
        title: data.title,
        description: data.description || '',
        cover_image_url: data.cover_image_url || '',
        registration_start: data.registration_start ? data.registration_start.slice(0, 16) : '',
        registration_end: data.registration_end ? data.registration_end.slice(0, 16) : '',
        status: data.status,
        first_place_percent: data.first_place_percent || 90,
        second_place_percent: data.second_place_percent || 75,
        third_place_percent: data.third_place_percent || 60,
        diploma_text: data.diploma_text || ''
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
      ...formData,
      registration_start: formData.registration_start || null,
      registration_end: formData.registration_end || null,
      first_place_percent: parseInt(formData.first_place_percent as any),
      second_place_percent: parseInt(formData.second_place_percent as any),
      third_place_percent: parseInt(formData.third_place_percent as any),
      updated_at: new Date().toISOString()
    };

    let error;
    if (id && id !== 'new') {
      ({ error } = await supabase.from('olympiads').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('olympiads').insert([{ ...payload, created_at: new Date().toISOString() }]));
    }

    if (error) {
      alert('Ошибка сохранения: ' + error.message);
    } else {
      navigate('/admin/olympiads');
    }
    setLoading(false);
  };

  if (loading && id !== 'new') return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate('/admin/olympiads')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Назад к списку
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id && id !== 'new' ? 'Редактирование олимпиады' : 'Создание новой олимпиады'}
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
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL обложки</label>
            <input
              type="url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начало регистрации</label>
              <input
                type="datetime-local"
                name="registration_start"
                value={formData.registration_start}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Окончание регистрации</label>
              <input
                type="datetime-local"
                name="registration_end"
                value={formData.registration_end}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1 место, %</label>
              <input
                type="number"
                name="first_place_percent"
                value={formData.first_place_percent}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2 место, %</label>
              <input
                type="number"
                name="second_place_percent"
                value={formData.second_place_percent}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">3 место, %</label>
              <input
                type="number"
                name="third_place_percent"
                value={formData.third_place_percent}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст для диплома (опционально)</label>
            <textarea
              name="diploma_text"
              value={formData.diploma_text}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликована</option>
              <option value="ongoing">Идёт</option>
              <option value="finished">Завершена</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/olympiads')}
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

export default AdminOlympiadForm;
