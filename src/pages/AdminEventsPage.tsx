import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2} from 'lucide-react';

// Тип мероприятия (можно импортировать из общего файла, но продублируем для наглядности)
interface Event {
  id: string;
  title: string;
  description: string;
  speaker_name?: string;
  speaker_position?: string;
  speaker_company?: string;
  format: 'online' | 'offline' | 'hybrid';
  platform?: string;
  meeting_url?: string;
  recording_url?: string;
  event_type: 'lecture' | 'webinar' | 'meeting' | 'excursion' | 'masterclass';
  max_participants: number;
  current_participants: number;
  start_time: string;
  end_time: string;
  registration_deadline?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  cover_image_url?: string;
  materials_url?: string[];
  tags?: string[];
}

const AdminEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    speaker_name: '',
    speaker_position: '',
    speaker_company: '',
    format: 'online',
    platform: '',
    meeting_url: '',
    event_type: 'lecture',
    max_participants: 50,
    start_time: '',
    end_time: '',
    registration_deadline: '',
    tags: [],
    cover_image_url: '',
  });

  // Проверка прав администратора
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      const { data } = await supabase.rpc('is_admin');
      setIsAdmin(!!data);
      if (!data) navigate('/');
    };
    checkAdmin();
  }, [navigate]);

  // Загрузка списка мероприятий
  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Обработка ввода в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка тегов (просто строка через запятую)
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  // Сохранение мероприятия (создание или обновление)
  const handleSave = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      alert('Заполните обязательные поля');
      return;
    }

    const payload = {
      ...formData,
      // Преобразуем пустые строки в null для optional полей
      speaker_name: formData.speaker_name || null,
      speaker_position: formData.speaker_position || null,
      speaker_company: formData.speaker_company || null,
      platform: formData.platform || null,
      meeting_url: formData.meeting_url || null,
      recording_url: null,
      current_participants: editingEvent ? editingEvent.current_participants : 0,
      status: 'scheduled',
    };

    if (editingEvent) {
      // Обновление
      const { error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', editingEvent.id);
      if (error) {
        alert('Ошибка при обновлении: ' + error.message);
      } else {
        fetchEvents();
        cancelForm();
      }
    } else {
      // Создание нового
      const { error } = await supabase
        .from('events')
        .insert([payload]);
      if (error) {
        alert('Ошибка при создании: ' + error.message);
      } else {
        fetchEvents();
        cancelForm();
      }
    }
  };

  // Удаление мероприятия
  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить мероприятие? Это действие нельзя отменить.')) return;
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Ошибка при удалении: ' + error.message);
    } else {
      fetchEvents();
    }
  };

  // Отмена формы
  const cancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      speaker_name: '',
      speaker_position: '',
      speaker_company: '',
      format: 'online',
      platform: '',
      meeting_url: '',
      event_type: 'lecture',
      max_participants: 50,
      start_time: '',
      end_time: '',
      registration_deadline: '',
      tags: [],
      cover_image_url: '',
    });
  };

  // Редактирование существующего
  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      speaker_name: event.speaker_name || '',
      speaker_position: event.speaker_position || '',
      speaker_company: event.speaker_company || '',
      format: event.format,
      platform: event.platform || '',
      meeting_url: event.meeting_url || '',
      event_type: event.event_type,
      max_participants: event.max_participants,
      start_time: event.start_time.slice(0, 16), // формат для input datetime-local
      end_time: event.end_time.slice(0, 16),
      registration_deadline: event.registration_deadline?.slice(0, 16) || '',
      tags: event.tags || [],
      cover_image_url: event.cover_image_url || '',
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!isAdmin) return null; // редирект уже сработал

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate('/cabinet')}
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад в личный кабинет
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Управление мероприятиями</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить мероприятие
          </button>
        </div>

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Редактировать' : 'Новое'} мероприятие</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Основные поля */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Спикер */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя спикера</label>
                <input
                  type="text"
                  name="speaker_name"
                  value={formData.speaker_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <input
                  type="text"
                  name="speaker_position"
                  value={formData.speaker_position}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                <input
                  type="text"
                  name="speaker_company"
                  value={formData.speaker_company}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Тип и формат */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип мероприятия</label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="lecture">Лекция</option>
                  <option value="webinar">Вебинар</option>
                  <option value="meeting">Встреча</option>
                  <option value="excursion">Экскурсия</option>
                  <option value="masterclass">Мастер-класс</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="online">Онлайн</option>
                  <option value="offline">Офлайн</option>
                  <option value="hybrid">Гибрид</option>
                </select>
              </div>

              {/* Дата и время */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало *</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Окончание *</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн регистрации</label>
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Платформа и ссылка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Платформа</label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Zoom, SberJazz и т.п."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на подключение</label>
                <input
                  type="url"
                  name="meeting_url"
                  value={formData.meeting_url}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              {/* Макс. участников */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Макс. участников</label>
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="1"
                />
              </div>

              {/* Ссылка на обложку */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на изображение обложки</label>
                <input
                  type="url"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              {/* Теги */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Теги (через запятую)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags?.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="геология, бурение, лекция"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium"
              >
                Сохранить
              </button>
            </div>
          </div>
        )}

        {/* Список мероприятий */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Название</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Дата</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Тип</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Участников</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{event.title}</td>
                  <td className="px-4 py-3">{new Date(event.start_time).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3">
                    {event.event_type === 'lecture' ? 'Лекция' :
                     event.event_type === 'webinar' ? 'Вебинар' :
                     event.event_type === 'meeting' ? 'Встреча' :
                     event.event_type === 'excursion' ? 'Экскурсия' : 'Мастер-класс'}
                  </td>
                  <td className="px-4 py-3">{event.current_participants} / {event.max_participants}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status === 'scheduled' ? 'Запланировано' :
                       event.status === 'ongoing' ? 'Идёт' :
                       event.status === 'completed' ? 'Завершено' : 'Отменено'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => editEvent(event)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Редактировать"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Пока нет мероприятий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;