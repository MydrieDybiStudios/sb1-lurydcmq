import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    members?: { user_id: string }[];
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const createdDate = new Date(project.created_at).toLocaleDateString('ru-RU');

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'Нет описания'}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {createdDate}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {project.members?.length || 0} участников
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;