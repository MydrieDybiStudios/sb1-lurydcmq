import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Olympiad {
  id: number;
  title: string;
  registration_start: string | null;
  registration_end: string | null;
  status: string;
}

const AdminOlympiadsPage: React.FC = () => {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('olympiads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setOlympiads(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить олимпиаду? Это действие нельзя отменить.')) return;
    const { error } = await supabase.from('olympiads').delete().eq('id', id);
    if (error) alert('Ошибка: ' + error.message);
    else fetchOlympiads();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'published': return 'Опубликована';
      case 'ongoing': return 'Идёт';
      case 'finished': return 'Завершена';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-600';
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'finished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Управление олимпиадами</h1>
        <button
          onClick={() => navigate('/admin/olympiads/new')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Создать олимпиаду
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Название</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Регистрация</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Статус</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {olympiads.map(olympiad => (
                <tr key={olympiad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{olympiad.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {olympiad.registration_start
                      ? new Date(olympiad.registration_start).toLocaleDateString()
                      : 'не указано'}{' '}
                    -{' '}
                    {olympiad.registration_end
                      ? new Date(olympiad.registration_end).toLocaleDateString()
                      : 'не указано'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(olympiad.status)}`}>
                      {getStatusText(olympiad.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/olympiads/${olympiad.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/olympiads/${olympiad.id}/stages`)}
                      className="text-green-600 hover:text-green-800"
                      title="Этапы"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(olympiad.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {olympiads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Пока нет олимпиад. Создайте первую!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOlympiadsPage;
