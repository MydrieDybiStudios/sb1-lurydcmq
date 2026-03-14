// src/components/CoursesSection.tsx
import React, { useState, useEffect } from 'react';
import coursesData from '../data/coursesData';
import { Course } from '../types/course';

interface CoursesSectionProps {
  onStartCourse: (courseId: number) => void;
  selectedDirection?: string | null;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ onStartCourse, selectedDirection }) => {
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const filteredCourses = selectedDirection
    ? coursesData.filter(course => course.directions.includes(selectedDirection))
    : coursesData;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCourses(filteredCourses);
    }, 300);
    return () => clearTimeout(timer);
  }, [filteredCourses]);

  const handleImageError = (courseId: number) => {
    setImageErrors(prev => new Set(prev).add(courseId));
  };

  const getCourseImageUrl = (courseId: number) => {
    return `/images/courses/course-${courseId}.jpg`;
  };

  const getFallbackGradient = (courseId: number) => {
    const gradients = [
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
      'linear-gradient(135deg, #6B21A8 0%, #8B5CF6 100%)',
      'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)',
    ];
    return gradients[courseId % gradients.length];
  };

  const getFallbackIcon = (courseId: number) => {
    const icons = ['🛢️', '⚡', '💧', '🔧', '🏭', '📊', '🔬', '🌍', '📈', '⚙️'];
    return icons[courseId % icons.length];
  };

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Нет курсов для выбранного направления.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCourses.map((course, index) => (
        <div
          key={course.id}
          className={`course-card bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
            visibleCourses.includes(course)
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
          style={{ 
            transitionDelay: `${index * 100}ms`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Блок с изображением - фиксированная высота */}
          <div className="h-48 bg-gray-800 relative overflow-hidden group flex-shrink-0">
            {!imageErrors.has(course.id) ? (
              <img
                src={getCourseImageUrl(course.id)}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleImageError(course.id)}
                loading="lazy"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ background: getFallbackGradient(course.id) }}
              >
                <span className="text-6xl text-black opacity-50">
                  {getFallbackIcon(course.id)}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Количество уроков на изображении */}
            <div className="absolute top-4 right-4 bg-black/70 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-400">
              {course.lessons.length} уроков
            </div>
          </div>

          {/* Контент курса - flex колонка для выравнивания кнопки внизу */}
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white flex flex-col flex-grow">
            {/* Заголовок - может быть разной длины */}
            <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-yellow-600 transition-colors">
              {course.title}
            </h3>
            
            {/* Описание - занимает доступное пространство */}
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              {course.description}
            </p>

            {/* Кнопка "Начать" справа - всегда внизу */}
            <div className="flex justify-end mt-auto pt-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 text-sm"
                onClick={() => onStartCourse(course.id)}
              >
                Начать
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesSection;