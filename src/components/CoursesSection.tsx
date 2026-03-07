// src/components/CoursesSection.tsx
import React, { useState, useEffect } from 'react';
import {
  File as Oil,
  History,
  Mountain,
  PenTool as Tool,
  Truck,
  Leaf,
  FlaskRound as Flask,
  Cpu,
  Database,
  Layers,
  Shield,
  TreePine,
  Wind,
  ClipboardList,
} from 'lucide-react';
import coursesData from '../data/coursesData';
import { Course } from '../types/course';

interface CoursesSectionProps {
  onStartCourse: (courseId: number) => void;
  selectedDirection?: string | null;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ onStartCourse, selectedDirection }) => {
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);

  const filteredCourses = selectedDirection
    ? coursesData.filter(course => course.directions.includes(selectedDirection))
    : coursesData;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCourses(filteredCourses);
    }, 300);
    return () => clearTimeout(timer);
  }, [filteredCourses]);

  // Иконки для всех курсов (id от 1 до 14)
  const courseIcons: { [key: number]: JSX.Element } = {
    1: <Oil className="text-yellow-400 text-6xl" />,
    2: <History className="text-yellow-400 text-6xl" />,
    3: <Mountain className="text-yellow-400 text-6xl" />,
    4: <Tool className="text-yellow-400 text-6xl" />,
    5: <Truck className="text-yellow-400 text-6xl" />,
    6: <Leaf className="text-yellow-400 text-6xl" />,
    7: <Flask className="text-yellow-400 text-6xl" />,
    8: <Cpu className="text-yellow-400 text-6xl" />,
    9: <Database className="text-yellow-400 text-6xl" />,
    10: <Layers className="text-yellow-400 text-6xl" />,
    11: <Shield className="text-yellow-400 text-6xl" />,
    12: <TreePine className="text-yellow-400 text-6xl" />,
    13: <Wind className="text-yellow-400 text-6xl" />,
    14: <ClipboardList className="text-yellow-400 text-6xl" />,
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
          className={`course-card bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 ${
            visibleCourses.includes(course)
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="h-48 bg-gray-800 flex items-center justify-center">
            {courseIcons[course.id] || <Oil className="text-yellow-400 text-6xl" />}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {course.lessons.length} уроков
              </span>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition"
                onClick={() => onStartCourse(course.id)}
              >
                Начать курс
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesSection;
