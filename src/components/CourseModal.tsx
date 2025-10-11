import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import CourseContent from './CourseContent';
import TestComponent from './TestComponent';
import ResultsComponent from './ResultsComponent';
import { Course } from '../types/course';
import { supabase } from '../lib/supabaseClient';

// ---------- Локальный Toast (из профиля) ----------
const Toast: React.FC<{
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-5 right-5 min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-transform transform ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  );
};

// ---------- Компонент модалки курса ----------
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

 useEffect(() => {
  if (course && userName) {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_name', userName)
        .eq('course_id', course.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setTestResults({
          score: data[0].score,
          total: data[0].total,
          percentage: data[0].percentage,
        });
        setIsResultsMode(true);
      }
    };
    fetchProgress();
  }
}, [course, userName]);

  // Сброс при смене курса
  useEffect(() => {
    setCurrentLessonIndex(0);
    setIsTestMode(false);
    setIsResultsMode(false);
    setTestResults(null);
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
      setIsTestMode(true);
    }
  };

const handleTestSubmit = async (score: number, total: number) => {
  const percentage = Math.round((score / total) * 100);
  setTestResults({ score, total, percentage });
  setIsTestMode(false);
  setIsResultsMode(true);

  if (!course) return;

  try {
    // ✅ Upsert: сохраняем прогресс, обновляем если уже есть запись
    const { data, error } = await supabase
      .from("progress")
      .upsert(
        [
          {
            user_name: userName,
            course_id: course.id,
            score,
            total,
            percentage,
            updated_at: new Date().toISOString(),
          },
        ],
        {
          onConflict: ["user_name", "course_id"], // уникальный ключ
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("Ошибка сохранения результата:", error);
      setToastType("error");
      setToastMessage("❌ Не удалось сохранить результат");
    } else {
      setToastType("success");
      setToastMessage("✅ Результат успешно сохранён!");
    }
  } catch (err) {
    console.error("Ошибка при upsert:", err);
    setToastType("error");
    setToastMessage("⚠️ Ошибка сохранения результата");
  }
};


  const handleCloseResults = () => {
    setIsResultsMode(false);
    onClose();
  };

  const handleDownloadCertificate = () => {
    setToastType('success');
    setToastMessage(`🎓 Сертификат для ${userName} успешно создан!`);
  };

  const progressPercentage = course ? ((currentLessonIndex + 1) / course.lessons.length) * 100 : 0;

  if (!course) return null;

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div
        className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } transition`}
      >
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

              {/* Прогресс */}
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
                <TestComponent test={course.test} onSubmit={handleTestSubmit} />
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

                {!isTestMode && (
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
      </div>
    </>
  );
};

export default CourseModal;
