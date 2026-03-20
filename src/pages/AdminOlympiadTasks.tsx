import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { OlympiadTask } from '../types/olympiad';

const AdminOlympiadTasks: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const [stageTitle, setStageTitle] = useState('');
  const [tasks, setTasks] = useState<OlympiadTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<OlympiadTask | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: '',
    correct_answer: '',
    max_score: 1,
    order_index: 0
  });

  useEffect(() => {
    fetchStage();
    fetchTasks();
  }, [stageId]);

  const fetchStage = async () => {
    const { data } = await supabase.from('olympiad_stages').select('title').eq('id', stageId).single();
    if (data) setStageTitle(data.title);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('olympiad_tasks')
      .select('*')
      .eq('stage_id', stageId)
      .order('order_index');
    setTasks(data || []);
    setLoading(false);
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('Удалить задание?')) return;
    await supabase.from('olympiad_tasks').delete().eq('id', taskId);
    fetchTasks();
  };

  const openForm = (task?: OlympiadTask) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        question: task.question || '',
        options: task.options ? task.options.join('\n') : '',
        correct_answer: task.correct_answer || '',
        max_score: task.max_score || 1,
        order_index: task.order_index || 0
      });
    } else {
      setEditingTask(null);
      setFormData({
        question: '',
        options: '',
        correct_answer: '',
        max_score: 1,
        order_index: tasks.length
      });
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    const optionsArray = formData.options.split('\n').map(s => s.trim()).filter(Boolean);
    const payload = {
      stage_id: stageId,
      task_type: 'test',
      question: formData.question,
      options: optionsArray,
      correct_answer: formData.correct_answer,
      max_score: parseInt(formData.max_score as any),
      order_index: parseInt(formData.order_index as any)
    };

    if (editingTask) {
      await supabase.from('olympiad_tasks').update(payload).eq('id', editingTask.id);
    } else {
      await supabase.from('olympiad_tasks').insert([payload]);
    }
    setShowForm(false);
    fetchTasks();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} />
        Назад
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Задания этапа: {stageTitle}</h1>
        <button
          onClick={() => openForm()}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Добавить задание
        </button>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{task.question}</p>
                <p className="text-sm text-gray-500">Баллов: {task.max_score}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openForm(task)} className="text-blue-600">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(task.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{editingTask ? 'Редактировать' : 'Новое'} задание</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Вопрос</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Варианты ответов (каждый с новой строки)</label>
                <textarea
                  value={formData.options}
                  onChange={e => setFormData({ ...formData, options: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Правильный ответ (текст варианта)</label>
                <input
                  type="text"
                  value={formData.correct_answer}
                  onChange={e => setFormData({ ...formData, correct_answer: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Баллы</label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={e => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Порядок</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOlympiadTasks;
