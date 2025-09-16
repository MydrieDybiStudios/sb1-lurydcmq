import React from 'react';
import { GraduationCap, Video, CheckCircle, Trophy } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">О платформе</h2>
        
        <div className="flex flex-col md:flex-row items-center mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src="https://images.unsplash.com/photo-1508503570184-d9c1e157d9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                 alt="Обучение" 
                 className="rounded-lg shadow-lg w-full transform hover:scale-105 transition duration-500" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h3 className="text-2xl font-bold mb-4">Интерактивное обучение нефтегазовой отрасли</h3>
            <p className="text-gray-700 mb-4">
              Платформа "НефтеГаз-Квант" создана для школьников, интересующихся нефтегазовой отраслью. 
              Мы предлагаем современный подход к обучению с использованием видеоуроков, интерактивных тестов и системы достижений.
            </p>
            <p className="text-gray-700 mb-4">
              Наши курсы разработаны экспертами отрасли и преподавателями ведущих вузов. 
              Материалы адаптированы для школьного возраста и позволяют получить комплексное представление о нефтегазовой сфере.
            </p>
            <div className="flex space-x-4">
              <div className="bg-yellow-500 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Сертификаты</h4>
                <p className="text-gray-600">Получайте именные сертификаты после прохождения курсов</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-yellow-500 mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Видеоуроки</h3>
            <p className="text-gray-600">Доступные объяснения сложных тем с наглядными примерами</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-yellow-500 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Тесты</h3>
            <p className="text-gray-600">Интерактивные тесты для проверки знаний после каждого урока</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-yellow-500 mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Достижения</h3>
            <p className="text-gray-600">Система наград за успехи в обучении</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;