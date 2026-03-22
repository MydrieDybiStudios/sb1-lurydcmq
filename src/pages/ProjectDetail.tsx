import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Users, CheckSquare, FileText, MessageSquare, Settings } from 'lucide-react';
import TaskList from '../components/TaskList';
import FileList from '../components/FileList';
import Discussion from '../components/Discussion';
import InviteMember from '../components/InviteMember';

type Tab = 'tasks' | 'files' | 'discussion' | 'members';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (id && user) {
      fetchProject();
      fetchMembers();
    }
  }, [id, user]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(error);
      navigate('/projects');
      return;
    }
    setProject(data);
    setIsOwner(data.owner_id === user?.id);
    setLoading(false);
  };

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('project_members')
      .select('user_id, role, profiles:user_id(email, full_name)')
      .eq('project_id', id);
    setMembers(data || []);
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!project) return <div className="text-center py-12">Проект не найден</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад к проектам
        </button>

        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>

        {/* Вкладки */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`pb-3 px-1 font-medium text-sm ${activeTab === 'tasks' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CheckSquare className="inline w-5 h-5 mr-2" />
              Задачи
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`pb-3 px-1 font-medium text-sm ${activeTab === 'files' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FileText className="inline w-5 h-5 mr-2" />
              Файлы
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-3 px-1 font-medium text-sm ${activeTab === 'discussion' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare className="inline w-5 h-5 mr-2" />
              Обсуждение
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 px-1 font-medium text-sm ${activeTab === 'members' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="inline w-5 h-5 mr-2" />
              Участники
            </button>
          </nav>
        </div>

        {/* Контент вкладки */}
        <div>
          {activeTab === 'tasks' && <TaskList projectId={id!} isOwner={isOwner} userId={user?.id} />}
          {activeTab === 'files' && <FileList projectId={id!} userId={user?.id} />}
          {activeTab === 'discussion' && <Discussion projectId={id!} userId={user?.id} />}
          {activeTab === 'members' && (
            <div>
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Участники проекта</h3>
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.user_id} className="flex justify-between items-center border-b pb-2">
                      <span>{m.profiles?.email || m.profiles?.full_name || m.user_id}</span>
                      <span className="text-sm text-gray-500 capitalize">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              {isOwner && (
                <InviteMember projectId={id!} onInvited={fetchMembers} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;