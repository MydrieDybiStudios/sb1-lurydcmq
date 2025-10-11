import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import CourseContent from './CourseContent';
import TestComponent from './TestComponent';
import ResultsComponent from './ResultsComponent';
import { Course } from '../types/course';
import { supabase } from '../lib/supabaseClient';

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
  const [awarding, setAwarding] = useState(false); // блокировка UI при записи в БД

  // Reset state when course changes
  useEffect(() => {
    setCurrentLessonIndex(0);
    setIsTestMode(false);
    setIsResultsMode(false);
    setTestResults(null);
    setShowCertificate(false);
    setAwarding(false);
  }, [course]);

  // --- Helper: mark course complete and award achievement ---
  const markCourseCompletedAndAward = async () => {
    if (!course) return;
    setAwarding(true);

    try {
      // Get current user
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (user == null) {
        alert('Требуется войти в систему, чтобы сохранить прогресс.');
        return;
      }
      const userId = user.id;

      // 1) Upsert user_courses: если запись есть — обновляем, если нет — вставляем
      // сначала пытаем найти существующую запись
      const { data: existing, error: selErr } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .limit(1)
        .maybeSingle();

      if (selErr && selErr.code !== 'PGRST116') {
        // PGRST116 — not found in some setups; но если другая ошибка — логируем
        console.error('Ошибка при поиске user_courses:', selErr);
      }

      const nowIso = new Date().toISOString();
      if (existing) {
        const { error: updErr } = await supabase
          .from('user_courses')
          .update({
            progress: 100,
            completed: true,
            completed_at: nowIso,
            updated_at: nowIso,
          })
          .eq('id', (existing as any).id);
        if (updErr) console.error('Ошибка обновления user_courses:', updErr);
      } else {
        const { error: insErr } = await supabase
          .from('user_courses')
          .insert({
            user_id: userId,
            course_id: course.id,
            progress: 100,
            completed: true,
            completed_at: nowIso,
            created_at: nowIso,
            updated_at: nowIso,
          });
        if (insErr) console.error('Ошибка вставки user_courses:', insErr);
      }

      // 2) Найти ачивку, привязанную к этому курсу (по course_id или по имени курса)
      // Сначала пробуем найти achievement с course_id = course.id
      let achId: number | null = null;
      const { data: achByCourse, error: achCourseErr } = await supabase
        .from('achievements')
        .select('id')
        .eq('course_id', course.id)
        .limit(1)
        .maybeSingle();

      if (achCourseErr) {
        console.error('Ошибка поиска ачивки по course_id:', achCourseErr);
      } else if (achByCourse) {
        achId = (achByCourse as any).id;
      }

      // Если не нашли — попробуем по имени (name/title)
      if (!achId) {
        const { data: achByName, error: achNameErr } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', course.title)
          .limit(1)
          .maybeSingle();

        if (achNameErr) {
          console.error('Ошибка поиска ачивки по имени:', achNameErr);
        } else if (achByName) {
          achId = (achByName as any).id;
        }
      }

      // 3) Если ачивка найдена — проверить, есть ли запись в user_achievements — если нет, вставить
      if (achId) {
        const { data: already, error: alreadyErr } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId)
          .eq('achievement_id', achId)
          .limit(1)
          .maybeSingle();

        if (alreadyErr && alreadyErr.code !== 'PGRST116') {
          console.error('Ошибка проверки user_achievements:', alreadyErr);
        }

        if (!already) {
          const { error: insUAErr } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achId,
              received_at: nowIso,
            });

          if (insUAErr) {
            console.error('Ошибка вставки user_achievements:', insUAErr);
          } else {
            // уведомление пользователю
            alert(`Поздравляем! Вы получили достижение по курсу "${course.title}"!`);
          }
        } else {
          // уже есть ачивка — можно не показывать ничего или показать сообщение
          console.log('Ачивка уже получена ранее.');
        }
      } else {
        console.log('Для этого курса не настроена ачивка (achievement).');
      }
    } catch (err) {
      console.error('Ошибка при сохранении прогресса / начислении ачивки:', err);
      alert('Ошибка при сохранении прогресса. Посмотри консоль.');
    } finally {
      setAwarding(false);
    }
  };

  // --- Навигация по урокам ---
  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const handleNextLesson = async () => {
    if (!course) return;

    if (currentLessonIndex < (course.lessons?.length ?? 0) - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // We are at the last lesson
      // If there's a test, start it, otherwise mark course complete immediately
      if (!course.test || course.test.length === 0) {
        // no test: mark complete and award
        await markCourseCompletedAndAward();
        // show results modal with 100%
        setTestResults({ score: 0, total: 0, percentage: 100 });
        setIsResultsMode(true);
        // optionally close modal after a delay:
        // setTimeout(() => onClose(), 1500);
      } else {
        setIsTestMode(true);
      }
    }
  };

  const handleTestSubmit = async (score: number, total: number) => {
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
    setTestResults({ score, total, percentage });
    setIsTestMode(false);
    setIsResultsMode(true);

    // По результатам теста считаем курс завершённым (в данном примере — всегда),
    // если нужна проверка проходного балла — добавь условие percentage >= 70 и т.д.
    await markCourseCompletedAndAward();
  };

  const handleCloseResults = () => {
    setIsResultsMode(false);
    onClose();
  };

  const handleDownloadCertificate = () => {
    setShowCertificate(true);
    alert(`Сертификат для ${userName} по курсу "${course?.title}" успешно создан!`);
  };

  // Progress percentage calculation
  const progressPercentage = course && course.lessons && course.lessons.length > 0
    ? ((currentLessonIndex + 1) / course.lessons.length) * 100
    : 0;

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
                  className="flex items-center space-x-1 ml-auto bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                  onClick={handleNextLesson}
                  disabled={awarding}
                >
                  <span>{currentLessonIndex === course.lessons.length - 1 ? 'Далее' : 'Далее'}</span>
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
              <p className="text-lg">на образовательной платформе "Югра.Нефть"</p>
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
