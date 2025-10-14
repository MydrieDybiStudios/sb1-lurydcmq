// src/pages/About.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Target, Users, BookOpen, Award } from "lucide-react";

const About = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">О проекте</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Инновационная образовательная платформа для изучения нефтегазовой отрасли
          </p>
        </div>

        {/* Цели и миссия */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Наша миссия</h2>
              <p className="text-gray-600 mb-4">
                Создать доступную и современную образовательную среду для учащихся, 
                интересующихся нефтегазовой отраслью. Мы стремимся к тому, чтобы каждый 
                студент мог получить качественные знания и практические навыки.
              </p>
              <p className="text-gray-600">
                Платформа "Югра.Нефть" объединяет лучшие образовательные практики 
                с современными технологиями для подготовки будущих специалистов.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Цель</h3>
                <p className="text-sm text-gray-600">Качественное образование</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Аудитория</h3>
                <p className="text-sm text-gray-600">Учащиеся и студенты</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Курсы</h3>
                <p className="text-sm text-gray-600">7 направлений</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Достижения</h3>
                <p className="text-sm text-gray-600">Система мотивации</p>
              </div>
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Профессиональная ориентация</h3>
            <p className="text-gray-600">
              Помогаем учащимся определиться с будущей профессией в нефтегазовой отрасли
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Доступные материалы</h3>
            <p className="text-gray-600">
              Все курсы и учебные материалы доступны бесплатно для всех учащихся
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Геймификация</h3>
            <p className="text-gray-600">
              Система достижений и сертификатов делает обучение увлекательным
            </p>
          </div>
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

export default About;
