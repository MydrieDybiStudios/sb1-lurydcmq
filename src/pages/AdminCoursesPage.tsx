import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  directions: string[];
  lessons: any;
  test: any;
  video_url?: string;
  icon?: string;
}

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    directions: '',
    lessons: '',
    test: '',
    video_url: '',
    icon: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Ошибка загрузки курсов:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateJSON = (str: string) => {
    if (!str.trim()) return true;
    try { JSON.parse(str); return true; } catch { return false; }
  };

  const handleSave = async () => {
    setError(null);
    if (!formData.title.trim()) return setError('Название обязательно');
    if (!validateJSON(formData.lessons)) return setError('Уроки должны быть валидным JSON');
    if (formData.test && !validateJSON(formData.test)) return setError('Тест должен быть валидным JSON');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      directions: formData.directions.split(',').map(s => s.trim()).filter(Boolean),
      lessons: formData.lessons ? JSON.parse(formData.lessons) : [],
      test: formData.test ? JSON.parse(formData.test) : null,
      video_url: formData.video_url.trim() || null,
      icon: formData.icon.trim() || null,
    };

    try {
      if (editingCourse) {
        await supabase.from('courses').update(payload).eq('id', editingCourse.id);
      } else {
        await supabase.from('courses').insert([payload]);
      }
      fetchCourses();
      cancelForm();
    } catch (err: any) {
      setError('Ошибка сохранения: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить курс?')) return;
    await supabase.from('courses').delete().eq('id', id);
    fetchCourses();
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      directions: course.directions ? course.directions.join(', ') : '',
      lessons: JSON.stringify(course.lessons, null, 2),
      test: JSON.stringify(course.test, null, 2),
      video_url: course.video_url || '',
      icon: course.icon || ''
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({ title: '', description: '', directions: '', lessons: '', test: '', video_url: '', icon: '' });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Навигация */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/admin/events')} className="text-gray-600 hover:text-yellow-600 flex items-center gap-1">
            <ArrowLeft className="w-5 h-5" /> Назад в админку
          </button>
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => navigate('/admin/events')}
              className={`pb-2 px-4 ${location.pathname === '/admin/events' ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500'}`}
            >
              Мероприятия
            </button>
            <button
              onClick={() => navigate('/admin/courses')}
              className={`pb-2 px-4 ${location.pathname === '/admin/courses' ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500'}`}
            >
              Курсы
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Управление курсами</h1>
          <button onClick={() => setShowForm(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Добавить курс
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">{editingCourse ? 'Редактировать' : 'Новый'} курс</h2>
            <div className="grid gap-4">
              <input name="title" placeholder="Название *" value={formData.title} onChange={handleInputChange} className="border rounded-lg px-3 py-2" />
              <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleInputChange} rows={3} className="border rounded-lg px-3 py-2" />
              <input name="directions" placeholder="Направления (через запятую)" value={formData.directions} onChange={handleInputChange} className="border rounded-lg px-3 py-2" />
              <div>
                <label className="block text-sm font-medium mb-1">Уроки (JSON-массив) *</label>
                <textarea name="lessons" value={formData.lessons} onChange={handleInputChange} rows={6} className="w-full border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Тест (JSON-объект, опционально)</label>
                <textarea name="test" value={formData.test} onChange={handleInputChange} rows={5} className="w-full border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
              <input name="video_url" placeholder="URL видео" value={formData.video_url} onChange={handleInputChange} className="border rounded-lg px-3 py-2" />
              <input name="icon" placeholder="Иконка (эмодзи)" value={formData.icon} onChange={handleInputChange} className="border rounded-lg px-3 py-2" />
              <div className="flex justify-end gap-3">
                <button onClick={cancelForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Отмена</button>
                <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg">Сохранить</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Загрузка...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Курсов пока нет</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Название</th><th className="px-4 py-3 text-left">Направления</th><th className="px-4 py-3">Действия</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map(c => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{c.id}</td>
                    <td className="px-4 py-3 font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {Array.isArray(c.directions) ? c.directions.join(', ') : ''}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => editCourse(c)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;