// src/pages/HowItWorksPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, BookOpen, GraduationCap, Award, Star, Users } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: "Регистрация",
      description: "Создайте аккаунт и укажите ваш класс или образовательное учреждение",
      details: ["Быстрая регистрация через email", "Указание класса/курса", "Создание личного профиля"]
    },
    {
      number: "2",
      icon: BookOpen,
      title: "Выбор курса",
      description: "Выберите подходящий курс по нефтегазовой тематике из нашего каталога",
      details: ["7 основных курсов", "Разные уровни сложности", "Постепенное изучение"]
    },
    {
      number: "3",
      icon: GraduationCap,
      title: "Обучение",
      description: "Проходите интерактивные уроки, изучайте материалы и выполняйте задания",
      details: ["Интерактивные материалы", "Практические задания", "Пошаговое изучение"]
    },
    {
      number: "4",
      icon: Award,
      title: "Тестирование",
      description: "Пройдите итоговый тест для проверки полученных знаний",
      details: ["Контрольные вопросы", "Минимальный порог - 70%", "Неограниченное количество попыток"]
    },
    {
      number: "5",
      icon: Star,
      title: "Достижения",
      description: "Получайте достижения и сертификаты за успешное прохождение курсов",
      details: ["Система достижений", "Именные сертификаты", "Прогресс обучения"]
    },
    {
      number: "6",
      icon: Users,
      title: "Сообщество",
      description: "Присоединяйтесь к образовательному сообществу и делитесь успехами",
      details: ["Обмен опытом", "Совместные проекты", "Поддержка преподавателей"]
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Как работает платформа</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Простой и понятный процесс обучения, который поможет вам освоить основы нефтегазовой отрасли
          </p>
        </div>

        {/* Шаги обучения */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{step.number}</span>
                </div>
                
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-yellow-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                <ul className="text-sm text-gray-500 text-left space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Преимущества */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-8">Преимущества нашей платформы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Бесплатный доступ</h3>
                <p className="text-gray-600">Все курсы доступны совершенно бесплатно для учащихся</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Сертификаты</h3>
                <p className="text-gray-600">Получайте именные сертификаты о прохождении курсов</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Геймификация</h3>
                <p className="text-gray-600">Система достижений делает обучение увлекательным</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Практические знания</h3>
                <p className="text-gray-600">Курсы разработаны при участии industry-экспертов</p>
              </div>
            </div>
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

export default HowItWorksPage;
