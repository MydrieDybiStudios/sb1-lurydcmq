// src/components/CourseModal.tsx
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import CourseContent from './CourseContent';
import TestComponent from './TestComponent';
import ResultsComponent from './ResultsComponent';
import VideoModal from './VideoModal'; // Импортируем VideoModal
import { Course } from '../types/course';
import { supabase } from '../lib/supabaseClient';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [userId, setUserId] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // Состояние для видео

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error('Ошибка при получении пользователя:', error);
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  const handleTestSubmit = async (score: number, total: number) => {
    if (!course || !userId) {
      setToastType('error');
      setToastMessage('❌ Войдите в аккаунт, чтобы сохранить результат');
      return;
    }

    const percentage = Math.round((score / total) * 100);
    setTestResults({ score, total, percentage });
    setIsTestMode(false);
    setIsResultsMode(true);

    const { data: userData } = await supabase.auth.getUser();
    const userName =
      userData?.user?.user_metadata?.full_name ||
      userData?.user?.email ||
      'Без имени';

    const payload = {
      user_id: userId,
      user_name: userName,
      course_id: Number(course.id),
      score,
      total,
      percentage,
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from('progress').upsert([payload], { onConflict: ['user_id', 'course_id'] });

      if (percentage >= 70) {
        const achievementPayload = {
          user_id: userId,
          achievement_id: String(course.id),
          earned_at: new Date().toISOString(),
        };

        await supabase
          .from('user_achievements')
          .upsert([achievementPayload], { onConflict: ['user_id', 'achievement_id'] });

        setToastType('success');
        setToastMessage('✅ Прогресс и достижение сохранены!');
      } else {
        setToastType('success');
        setToastMessage('✅ Прогресс сохранен!');
      }
    } catch (err: any) {
      console.error('Ошибка при сохранении:', err);
      setToastType('error');
      setToastMessage('❌ Ошибка при сохранении результата');
    }
  };

  const handleRestart = () => {
    setCurrentLessonIndex(0);
    setIsTestMode(false);
    setIsResultsMode(false);
    setTestResults(null);
    setToastMessage(null);
  };

  const handleNextLesson = () => {
    if (!course) return;
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
    } else {
      setIsTestMode(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex((prev) => prev - 1);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentLessonIndex(0);
      setIsTestMode(false);
      setIsResultsMode(false);
      setTestResults(null);
      setToastMessage(null);
      setIsVideoModalOpen(false); // Сбрасываем состояние видео при закрытии
    }
  }, [isOpen]);

  const progressPercentage = course ? ((currentLessonIndex + 1) / course.lessons.length) * 100 : 0;

  if (!course) return null;

  // Если у курса есть свое видео, используем его
  const videoUrl = course.videoUrl || null;

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}

      {/* Модальное окно с видео */}
      {videoUrl && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoUrl}
          videoTitle={course.title}
        />
      )}

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-300`}
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 p-2 rounded-full transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {isResultsMode ? (
            <ResultsComponent
              results={testResults}
              courseName={course.title}
              courseId={course.id}
              onClose={onClose}
              onRestart={handleRestart}
            />
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{course.title}</h3>
                <button
                  onClick={onClose}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X />
                </button>
              </div>

              {/* Кнопка для видео - показываем только если есть видео */}
              {videoUrl ? (
                <div className="mb-6">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-6 rounded-xl transition transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 shadow-lg border-2 border-yellow-400/30"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span className="text-lg">Смотреть видеолекцию</span>
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                  Видео для этого курса пока не добавлено
                </div>
              )}

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${isTestMode ? 100 : progressPercentage}%` }}
                ></div>
              </div>

              {isTestMode ? (
                <TestComponent test={course.test} onSubmit={handleTestSubmit} />
              ) : (
                <CourseContent lesson={course.lessons[currentLessonIndex]} />
              )}

              <div className="mt-6 flex justify-between items-center">
                {!isTestMode && (
                  <button
                    className={`flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition ${
                      currentLessonIndex === 0 ? 'invisible' : 'visible'
                    }`}
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