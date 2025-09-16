import React, { useState, useEffect } from 'react';
import { File as Oil, History, Mountain, PenTool as Tool, Truck, Leaf, FlaskRound as Flask, PieChart } from 'lucide-react';
import coursesData from '../data/coursesData';
import { Course } from '../types/course';

interface CoursesSectionProps {
  onStartCourse: (courseId: number) => void;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ onStartCourse }) => {
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Animate courses appearing one by one
    const timer = setTimeout(() => {
      setVisibleCourses(coursesData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Map of course icons by id
  const courseIcons = {
    1: <Oil className="text-yellow-400 text-6xl" />,
    2: <History className="text-yellow-400 text-6xl" />,
    3: <Mountain className="text-yellow-400 text-6xl" />,
    4: <Tool className="text-yellow-400 text-6xl" />,
    5: <Truck className="text-yellow-400 text-6xl" />,
    6: <Leaf className="text-yellow-400 text-6xl" />,
    7: <Flask className="text-yellow-400 text-6xl" />,
  };

  return (
    <section id="courses" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Наши курсы</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course, index) => (
            <div 
              key={course.id}
              className={`course-card bg-white rounded-lg shadow-md overflow-hidden transition duration-500 transform ${
                visibleCourses.includes(course) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                {courseIcons[course.id as keyof typeof courseIcons]}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.lessons.length} уроков</span>
                  <button 
                    className="start-course-btn bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition"
                    onClick={() => onStartCourse(course.id)}
                  >
                    Начать курс
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;