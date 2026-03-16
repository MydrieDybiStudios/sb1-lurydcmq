import React from 'react';
import { GraduationCap, Video, CheckCircle, Trophy, Sparkles } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Декоративные элементы в стиле HeroSection */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Волнистый элемент внизу */}
      <div className="absolute bottom-0 left-0 right-0 text-gray-200 opacity-30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-current">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок (текст сохранён) */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 animate-fadeInUp">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-400">
            О платформе
          </span>
        </h2>

        {/* Основной блок — иконка + описание (тексты полностью из оригинала) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Левая часть — анимированная иконка */}
          <div className="lg:w-1/2 flex justify-center animate-fadeInLeft">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 w-48 h-48 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-500">
                <GraduationCap className="w-24 h-24 text-black" />
              </div>
              <div className="absolute -top-4 -right-4 bg-black text-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Правая часть — описание (текст в точности как в оригинале) */}
          <div className="lg:w-1/2 animate-fadeInRight">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Интерактивное обучение нефтегазовой отрасли
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Цифровая Образовательная Платформа «Югра.Нефть» создана для школьников,
              интересующихся нефтегазовой отраслью. Мы предлагаем современный подход к обучению
              с использованием видеоуроков, интерактивных тестов и системы достижений.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Наши курсы разработаны экспертами отрасли и преподавателями ведущих вузов.
              Материалы адаптированы для школьного возраста и позволяют получить комплексное
              представление о нефтегазовой сфере.
            </p>

            {/* Блок про сертификаты (полностью оригинальный) */}
            <div className="mt-8 bg-white rounded-2xl p-5 shadow-lg border border-gray-200 flex items-center gap-4 hover:shadow-xl transition">
              <div className="bg-yellow-500 text-black rounded-full w-14 h-14 flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Сертификаты</h4>
                <p className="text-gray-600">
                  Получайте именные сертификаты после прохождения курсов
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карточки преимуществ — тексты полностью оригинальные, дизайн обновлён */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-500 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Видеоуроки</h3>
            <p className="text-gray-600 leading-relaxed">
              Доступные объяснения сложных тем с наглядными примерами
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-500 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Тесты</h3>
            <p className="text-gray-600 leading-relaxed">
              Интерактивные тесты для проверки знаний после каждого урока
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-500 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Достижения</h3>
            <p className="text-gray-600 leading-relaxed">
              Система наград за успехи в обучении
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
