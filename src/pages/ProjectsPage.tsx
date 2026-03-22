import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, ArrowLeft } from 'lucide-react'; // импортируем иконку стрелки
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';

interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  members?: { user_id: string }[];
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        members:project_members(user_id)
      `)
      .eq('project_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setProjects(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cabinet')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад в кабинет
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Мои проекты</h1>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Создать проект
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">У вас пока нет проектов</p>
            <button
              onClick={() => navigate('/projects/new')}
              className="mt-4 text-yellow-600 hover:text-yellow-700"
            >
              Создать первый проект
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;