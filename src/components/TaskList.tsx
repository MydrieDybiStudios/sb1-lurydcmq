import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
}

interface TaskListProps {
  projectId: string;
  isOwner: boolean;
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId, isOwner, userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'todo'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setTasks(data || []);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      project_id: projectId,
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date || null,
      status: formData.status,
    };

    if (editingTask) {
      await supabase.from('project_tasks').update(payload).eq('id', editingTask.id);
    } else {
      await supabase.from('project_tasks').insert([payload]);
    }
    fetchTasks();
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', due_date: '', status: 'todo' });
  };

  const updateStatus = async (task: Task, newStatus: Task['status']) => {
    await supabase
      .from('project_tasks')
      .update({ status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null })
      .eq('id', task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (confirm('Удалить задачу?')) {
      await supabase.from('project_tasks').delete().eq('id', id);
      fetchTasks();
    }
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date?.slice(0, 10) || '',
      status: task.status,
    });
    setShowForm(true);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'in_progress') return <Circle className="w-5 h-5 text-yellow-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (loading) return <div className="text-center py-4">Загрузка задач...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Задачи</h2>
        {isOwner && (
          <button
            onClick={() => { setShowForm(true); setEditingTask(null); setFormData({ title: '', description: '', due_date: '', status: 'todo' }); }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200">
          <h3 className="font-bold mb-3">{editingTask ? 'Редактировать задачу' : 'Новая задача'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="title"
              placeholder="Название *"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="todo">К выполнению</option>
              <option value="in_progress">В работе</option>
              <option value="done">Выполнено</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">Отмена</button>
              <button type="submit" className="px-4 py-2 bg-yellow-500 rounded-lg">Сохранить</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <button onClick={() => updateStatus(task, task.status === 'done' ? 'todo' : 'done')} className="mt-1">
                  {getStatusIcon(task.status)}
                </button>
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                  {task.due_date && (
                    <p className="text-xs text-gray-400 mt-1">Срок: {new Date(task.due_date).toLocaleDateString('ru-RU')}</p>
                  )}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button onClick={() => editTask(task)} className="text-blue-500 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-center text-gray-500">Задач пока нет</p>}
      </div>
    </div>
  );
};

export default TaskList;