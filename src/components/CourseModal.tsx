import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import CourseContent from './CourseContent';
import TestComponent from './TestComponent';
import ResultsComponent from './ResultsComponent';
import { Course } from '../types/course';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isResultsMode, setIsResultsMode] = useState(false);
  const [testResults, setTestResults] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [userName, setUserName] = useState('Студент');
  const [showCertificate, setShowCertificate] = useState(false);

  // Reset state when course changes
  useEffect(() => {
    setCurrentLessonIndex(0);
    setIsTestMode(false);
    setIsResultsMode(false);
    setTestResults(null);
    setShowCertificate(false);
  }, [course]);

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const handleNextLesson = () => {
    if (!course) return;
    
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // If we're at the last lesson, start the test
      setIsTestMode(true);
    }
  };

  const handleTestSubmit = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    setTestResults({ score, total, percentage });
    setIsTestMode(false);
    setIsResultsMode(true);
  };

  const handleCloseResults = () => {
    setIsResultsMode(false);
    onClose();
  };

  const handleDownloadCertificate = () => {
    setShowCertificate(true);
    // In a real app, this would generate and download a certificate
    alert(`Сертификат для ${userName} по курсу "${course?.title}" успешно создан!`);
  };

  // Progress percentage calculation
  const progressPercentage = course ? ((currentLessonIndex + 1) / course.lessons.length) * 100 : 0;

  if (!course) return null;

  return (
    <div className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition`}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto">
        {isResultsMode ? (
          <ResultsComponent 
            results={testResults} 
            courseName={course.title}
            onClose={handleCloseResults}
            onDownloadCertificate={handleDownloadCertificate}
          />
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${isTestMode ? 100 : progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-6">
              <span>{isTestMode ? 'Тест' : `Урок ${currentLessonIndex + 1} из ${course.lessons.length}`}</span>
              <span>{isTestMode ? 'Финальный этап' : `${Math.round(progressPercentage)}% завершено`}</span>
            </div>
            
            {isTestMode ? (
              <TestComponent 
                test={course.test} 
                onSubmit={handleTestSubmit}
              />
            ) : (
              <CourseContent lesson={course.lessons[currentLessonIndex]} />
            )}
            
            <div className="mt-6 flex justify-between items-center">
              {!isTestMode && (
                <button 
                  className={`flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition ${currentLessonIndex === 0 ? 'invisible' : 'visible'}`}
                  onClick={handlePrevLesson}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
              )}
              
              {isTestMode ? (
                <div className="ml-auto">
                  {/* Test navigation is handled in the TestComponent */}
                </div>
              ) : (
                <button 
                  className="flex items-center space-x-1 ml-auto bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition"
                  onClick={handleNextLesson}
                >
                  <span>{currentLessonIndex === course.lessons.length - 1 ? 'Начать тест' : 'Далее'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full relative">
            <button 
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            
            <div className="border-8 border-yellow-500 p-8 text-center">
              <div className="flex justify-center mb-6">
                <Award className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Сертификат</h2>
              <p className="text-xl mb-2">Настоящим подтверждается, что</p>
              <p className="text-2xl font-bold mb-4">{userName}</p>
              <p className="text-xl mb-6">успешно завершил(а) курс</p>
              <p className="text-2xl font-bold mb-8">"{course.title}"</p>
              <p className="text-lg">на образовательной платформе "НефтеГаз-Квант"</p>
              <div className="mt-8 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">Дата выдачи: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition"
                onClick={() => alert('Сертификат сохранен!')}
              >
                Скачать PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModal;