// src/pages/AdminCoursesPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  video_url?: string;
  directions: string[];
  lessons: any;
  test: any;
  icon?: string;
}

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateJSON = (str: string): boolean => {
    if (!str.trim()) return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!formData.title.trim()) {
      setError('Название обязательно');
      return;
    }

    if (!validateJSON(formData.lessons)) {
      setError('Поле "Уроки" должно быть валидным JSON');
      return;
    }

    if (formData.test.trim() && !validateJSON(formData.test)) {
      setError('Поле "Тест" должно быть валидным JSON');
      return;
    }

    const payload: any = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      directions: formData.directions
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      lessons: JSON.parse(formData.lessons),
      test: formData.test ? JSON.parse(formData.test) : null,
      video_url: formData.video_url.trim() || null,
      icon: formData.icon.trim() || null,
    };

    console.log('editingCourse:', editingCourse);
    console.log('Режим:', editingCourse ? 'обновление' : 'вставка');
    console.log('Payload:', payload);

    try {
      let result;
      if (editingCourse) {
        result = await supabase
          .from('courses')
          .update(payload)
          .eq('id', editingCourse.id);
      } else {
        result = await supabase
          .from('courses')
          .insert([payload]);
      }

      const { data, error } = result;
      if (error) {
        setError(`Ошибка: ${error.message}${error.details ? ` (${error.details})` : ''}`);
        console.error('Детали ошибки:', error);
      } else {
        console.log('Успешно сохранено');
        fetchCourses();
        cancelForm();
      }
    } catch (err: any) {
      console.error('Исключение:', err);
      setError('Ошибка: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      alert('Ошибка удаления: ' + error.message);
    } else {
      fetchCourses();
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      directions: course.directions.join(', '),
      lessons: JSON.stringify(course.lessons, null, 2),
      test: JSON.stringify(course.test, null, 2),
      video_url: course.video_url || '',
      icon: course.icon || '',
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      directions: '',
      lessons: '',
      test: '',
      video_url: '',
      icon: ''
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      directions: '',
      lessons: '',
      test: '',
      video_url: '',
      icon: ''
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Навигация */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-1 hover:text-yellow-600"
          >
            <ArrowLeft className="w-5 h-5" /> Управление
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Курсы</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Управление курсами</h1>
          <button
            onClick={handleAddNew}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить курс
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Редактировать курс' : 'Новый курс'}
            </h2>
            <div className="grid gap-4">
              <input
                name="title"
                placeholder="Название *"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <textarea
                name="description"
                placeholder="Описание"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                name="directions"
                placeholder="Направления (через запятую)"
                value={formData.directions}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Уроки (JSON-массив) *
                </label>
                <textarea
                  name="lessons"
                  value={formData.lessons}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                  placeholder='[{"title":"Урок 1","content":"..."}, ...]'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тест (JSON-объект, опционально)
                </label>
                <textarea
                  name="test"
                  value={formData.test}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                  placeholder='{"title":"Тест","questions":[...]}'
                />
              </div>
              <input
                name="video_url"
                placeholder="URL видео"
                value={formData.video_url}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                name="icon"
                placeholder="Иконка (эмодзи)"
                value={formData.icon}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <div className="flex justify-end gap-3">
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
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Курсов пока нет. Нажмите "Добавить курс", чтобы создать первый.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Название</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Направления</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{course.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{course.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {Array.isArray(course.directions) ? course.directions.join(', ') : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        title="Редактировать"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Удалить"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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