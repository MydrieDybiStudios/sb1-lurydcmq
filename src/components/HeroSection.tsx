import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-white overflow-hidden py-20 md:py-28">
      {/* Анимированные фоновые элементы */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeInUp">
            Цифровая образовательная платформа <br />
            <span className="text-black bg-white/30 px-4 py-2 rounded-lg inline-block mt-2 backdrop-blur-sm">
              «Югра.Нефть»
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            Изучайте нефтегазовую отрасль с помощью интерактивных курсов, тестов и достижений. Получайте сертификаты и становитесь экспертом!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animation-delay-400">
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-black text-white hover:bg-gray-900 font-bold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-xl flex items-center justify-center text-lg"
            >
              Начать обучение
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-white bg-transparent hover:bg-white hover:text-black font-bold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-xl flex items-center justify-center text-lg"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </div>

      {/* Декоративная волна внизу (опционально) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-white opacity-10">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
