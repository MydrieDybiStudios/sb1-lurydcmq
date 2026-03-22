import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Вы не авторизованы');
      setLoading(false);
      return;
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{ title, description, owner_id: user.id }])
      .select()
      .single();

    if (projectError) {
      setError(projectError.message);
      setLoading(false);
      return;
    }

    // Добавить владельца как участника
    await supabase
      .from('project_members')
      .insert([{ project_id: project.id, user_id: user.id, role: 'owner' }]);

    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Создать новый проект</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Название проекта *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <textarea
            placeholder="Описание проекта"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/projects')} className="px-4 py-2 border rounded-lg">Отмена</button>
            <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg">
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreate;