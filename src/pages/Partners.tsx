// src/pages/Partners.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Building2, School, Award } from "lucide-react";

const Partners = () => {
  const partners = [
    {
      name: "МОБУ СОШ №1",
      type: "Образовательный партнёр",
      description: "Ведущая общеобразовательная школа Нефтеюганского района, предоставляющая площадку для реализации образовательных программ",
      logo: "logos/school1-logo.png", // Замените на реальный путь
      icon: School
    },
    {
      name: "Департамент Образования Нефтеюганского района",
      type: "Организационный партнёр",
      description: "Координатор образовательных инициатив и программ в районе",
      logo: "logos/education-department-logo.png", // Замените на реальный путь
      icon: Building2
    },
    {
      name: "РН-Юганскнефтегаз",
      type: "Информационный партнёр",
      description: "Ведущее нефтегазодобывающее предприятие региона, предоставляющее экспертизу и материалы для образовательных курсов",
      logo: "logos/rn-yugansk-logo.png", // Замените на реальный путь
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Хедер */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              UO
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">
                Цифровая Образовательная Платформа "Югра.Нефть"
              </h1>
            </div>
          </Link>
          <Link 
            to="/"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Наши партнёры</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Совместными усилиями мы создаём качественное образование для будущего нефтегазовой отрасли
          </p>
        </div>

        {/* Сетка партнёров */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={`Логотип ${partner.name}`}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <IconComponent className="w-10 h-10 text-yellow-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  partner.type.includes("Информационный") 
                    ? "bg-blue-100 text-blue-800"
                    : partner.type.includes("Образовательный")
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {partner.type}
                </span>
                
                <p className="text-gray-600 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Блок сотрудничества */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Станьте нашим партнёром</h2>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Мы открыты для сотрудничества с образовательными учреждениями и компаниями нефтегазовой отрасли
          </p>
          <button className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition">
            Связаться с нами
          </button>
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Цифровая Образовательная Платформа "Югра.Нефть". Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Partners;
