import React from 'react';
import { GraduationCap, Video, CheckCircle, Trophy, Sparkles } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black">
      {/* Волнистый чёрный элемент внизу (как в HeroSection) */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-20">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Чёрная полоска вверху */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок — чёрный, жирный, с тенью */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-12 drop-shadow-2xl">
          О платформе
        </h2>

        {/* Основной блок с иконкой и описанием */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Левая часть — иконка в чёрном круге */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-black w-48 h-48 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500 border-4 border-yellow-300">
                <GraduationCap className="w-24 h-24 text-yellow-400" />
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black rounded-full p-3 shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Правая часть — описание на чёрном фоне с прозрачностью */}
          <div className="lg:w-1/2 bg-black/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-yellow-500/30">
            <h3 className="text-3xl font-bold mb-6 text-yellow-400">
              Интерактивное обучение нефтегазовой отрасли
            </h3>
            <p className="text-white/90 mb-4 leading-relaxed">
              Цифровая Образовательная Платформа «Югра.Нефть» создана для школьников,
              интересующихся нефтегазовой отраслью. Мы предлагаем современный подход к обучению
              с использованием видеоуроков, интерактивных тестов и системы достижений.
            </p>
            <p className="text-white/90 mb-4 leading-relaxed">
              Наши курсы разработаны экспертами отрасли и преподавателями ведущих вузов.
              Материалы адаптированы для школьного возраста и позволяют получить комплексное
              представление о нефтегазовой сфере.
            </p>

            {/* Блок про сертификаты */}
            <div className="mt-6 bg-yellow-400/10 rounded-2xl p-5 border border-yellow-400/30 flex items-center gap-4 hover:bg-yellow-400/20 transition">
              <div className="bg-yellow-400 text-black rounded-full w-14 h-14 flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 text-lg">Сертификаты</h4>
                <p className="text-white/80">
                  Получайте именные сертификаты после прохождения курсов
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карточки преимуществ — чёрные с жёлтыми акцентами */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-black/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-yellow-500/30 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-400 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">Видеоуроки</h3>
            <p className="text-white/80 leading-relaxed">
              Доступные объяснения сложных тем с наглядными примерами
            </p>
          </div>

          <div className="group bg-black/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-yellow-500/30 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-400 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">Тесты</h3>
            <p className="text-white/80 leading-relaxed">
              Интерактивные тесты для проверки знаний после каждого урока
            </p>
          </div>

          <div className="group bg-black/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-yellow-500/30 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-yellow-400 text-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">Достижения</h3>
            <p className="text-white/80 leading-relaxed">
              Система наград за успехи в обучении
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
