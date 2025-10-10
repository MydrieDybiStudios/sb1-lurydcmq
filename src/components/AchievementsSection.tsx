import React from 'react';
import { Star, Mountain, HardHat, Crown, Medal } from 'lucide-react';

const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Система достижений</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Achievement 1 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-yellow-500 text-black font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-1">Новичок</h3>
            <p className="text-sm text-gray-600">Завершение первого курса</p>
          </div>
          
          {/* Achievement 2 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-gray-300 text-gray-600 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Mountain className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-1">Геолог-исследователь</h3>
            <p className="text-sm text-gray-600">Изучены основы геологии</p>
          </div>
          
          {/* Achievement 3 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-gray-300 text-gray-600 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <HardHat className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-1">Инженер добычи</h3>
            <p className="text-sm text-gray-600">Пройден курс по методам добычи</p>
          </div>
          
          {/* Achievement 4 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-gray-300 text-gray-600 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Crown className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-1">Мастер нефтегазовой отрасли</h3>
            <p className="text-sm text-gray-600">100% завершение курсов</p>
          </div>
          
          {/* Achievement 5 */}
          <div className="bg-gray-100 p-4 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-gray-300 text-gray-600 font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Medal className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-1">Легенда нефтегаза</h3>
            <p className="text-sm text-gray-600">90%+ правильных ответов во всех тестах</p>
          </div>
        </div>
        
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">Как получить достижения?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-sm">1</span>
              </div>
              <p>Проходите курсы последовательно, выполняя все уроки и тесты</p>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-sm">2</span>
              </div>
              <p>Старайтесь отвечать правильно на все вопросы тестов</p>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-sm">3</span>
              </div>
              <p>После завершения всех курсов вы получите сертификат и звание "Мастер нефтегазовой отрасли"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;