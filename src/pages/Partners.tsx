import React from "react";
import { Link } from "react-router-dom";
import { Building2, School, Award, Sparkles, ArrowRight, Globe, Handshake } from "lucide-react";

const Partners = () => {
  const partners = [
    {
      name: "МОБУ СОШ №1",
      type: "Образовательный партнёр",
      description: "Ведущая общеобразовательная школа Нефтеюганского района, предоставляющая площадку для реализации образовательных программ",
      logo: "logos/school1-logo.png", // Замените на реальный путь
      icon: School,
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    {
      name: "Департамент Образования Нефтеюганского района",
      type: "Организационный партнёр",
      description: "Координатор образовательных инициатив и программ в районе",
      logo: "logos/education-department-logo.png", // Замените на реальный путь
      icon: Building2,
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
      name: "РН-Юганскнефтегаз",
      type: "Информационный партнёр",
      description: "Ведущее нефтегазодобывающее предприятие региона, предоставляющее экспертизу и материалы для образовательных курсов",
      logo: "logos/rn-yugansk-logo.png", // Замените на реальный путь
      icon: Award,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Хедер с эффектом стекла */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold rounded-xl w-12 h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">
                <span className="text-yellow-400">ЦОП</span> "Югра.Нефть"
              </h1>
            </div>
          </Link>
          <Link 
            to="/"
            className="border border-yellow-500/50 hover:bg-yellow-500 hover:text-black text-yellow-400 font-medium py-2 px-4 rounded-full transition-all hover:scale-105 backdrop-blur-sm"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-16 relative">
        {/* Декоративные элементы */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

        {/* Заголовок с градиентом */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mb-6 shadow-2xl transform hover:rotate-6 transition">
            <Handshake className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
              Наши партнёры
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Совместными усилиями мы создаём качественное образование для будущего нефтегазовой отрасли
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Сетка партнёров */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {partners.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Градиентный фон при наведении */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative p-8">
                  {/* Иконка/логотип */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${partner.color} border ${partner.borderColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl`}>
                      {partner.logo ? (
                        <img 
                          src={partner.logo} 
                          alt={`Логотип ${partner.name}`}
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <IconComponent className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Название */}
                  <h3 className="text-2xl font-bold text-center mb-3 group-hover:text-yellow-400 transition">
                    {partner.name}
                  </h3>

                  {/* Бейдж типа */}
                  <div className="flex justify-center mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm border ${partner.badgeColor}`}>
                      {partner.type}
                    </span>
                  </div>

                  {/* Описание */}
                  <p className="text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition">
                    {partner.description}
                  </p>

                  {/* Декоративная линия снизу */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transition-all duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Блок сотрудничества */}
        <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-12 text-center overflow-hidden">
          {/* Фоновые элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-2xl animate-bounce">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Станьте нашим партнёром
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
              Мы открыты для сотрудничества с образовательными учреждениями и компаниями нефтегазовой отрасли
            </p>
            <button className="group bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 text-lg">
              Связаться с нами
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-black/80 backdrop-blur-sm border-t border-yellow-500/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Цифровая Образовательная Платформа "Югра.Нефть". Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Partners;
