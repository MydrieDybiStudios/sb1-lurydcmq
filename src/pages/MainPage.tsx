import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

// Импорты логотипов из папки src/logos/
import school1Logo from "../logos/school1-logo.png";
import educationDepartmentLogo from "../logos/education-department-logo.png";
import rnYuganskLogo from "../logos/rn-yugansk-logo.png";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: "👤",
      title: "Регистрация",
      description: "Создайте аккаунт и укажите ваш класс или образовательное учреждение",
      details: ["Быстрая регистрация через email", "Указание класса/курса", "Создание личного профиля"]
    },
    {
      number: "2",
      icon: "📚",
      title: "Выбор курса",
      description: "Выберите подходящий курс по нефтегазовой тематике из нашего каталога",
      details: ["7 основных курсов", "Разные уровни сложности", "Постепенное изучение"]
    },
    {
      number: "3",
      icon: "🎓",
      title: "Обучение",
      description: "Проходите интерактивные уроки, изучайте материалы и выполняйте задания",
      details: ["Интерактивные материалы", "Практические задания", "Пошаговое изучение"]
    },
    {
      number: "4",
      icon: "🏆",
      title: "Тестирование",
      description: "Пройдите итоговый тест для проверки полученных знаний",
      details: ["Контрольные вопросы", "Минимальный порог - 70%", "Неограниченное количество попыток"]
    },
    {
      number: "5",
      icon: "⭐",
      title: "Достижения",
      description: "Получайте достижения и сертификаты за успешное прохождение курсов",
      details: ["Система достижений", "Именные сертификаты", "Прогресс обучения"]
    },
    {
      number: "6",
      icon: "👥",
      title: "Сообщество",
      description: "Присоединяйтесь к образовательному сообществу и делитесь успехами",
      details: ["Обмен опытом", "Совместные проекты", "Поддержка преподавателей"]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Как работает платформа</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Простой и понятный процесс обучения, который поможет вам освоить основы нефтегазовой отрасли
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>
              
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{step.icon}</span>
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
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">Преимущества нашей платформы</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Бесплатный доступ</h4>
                <p className="text-gray-600">Все курсы доступны совершенно бесплатно для учащихся</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Сертификаты</h4>
                <p className="text-gray-600">Получайте именные сертификаты о прохождении курсов</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Геймификация</h4>
                <p className="text-gray-600">Система достижений делает обучение увлекательным</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Практические знания</h4>
                <p className="text-gray-600">Курсы разработаны при участии industry-экспертов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PartnersSection: React.FC = () => {
  const partners = [
    {
      name: "МОБУ СОШ №1",
      type: "Образовательный партнёр",
      description: "Ведущая общеобразовательная школа Нефтеюганского района, предоставляющая площадку для реализации образовательных программ",
      logo: school1Logo,
      icon: "🏫"
    },
    {
      name: "Департамент Образования Нефтеюганского района",
      type: "Организационный партнёр",
      description: "Координатор образовательных инициатив и программ в районе",
      logo: educationDepartmentLogo,
      icon: "🏢"
    },
    {
      name: "РН-Юганскнефтегаз",
      type: "Информационный партнёр",
      description: "Ведущее нефтегазодобывающее предприятие региона, предоставляющее экспертизу и материалы для образовательных курсов",
      logo: rnYuganskLogo,
      icon: "⛽"
    }
  ];

  return (
    <section id="partners" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши партнёры</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Совместными усилиями мы создаём качественное образование для будущего нефтегазовой отрасли
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div key={index} className="bg-gray-50 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={`Логотип ${partner.name}`}
                  className="w-12 h-12 object-contain"
                />
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
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Станьте нашим партнёром</h3>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Мы открыты для сотрудничества с образовательными учреждениями и компаниями нефтегазовой отрасли
          </p>
          <button className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition">
            Связаться с нами
          </button>
        </div>
      </div>
    </section>
  );
};

const AboutProjectSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">О проекте</h2>
              <p className="text-gray-600 mb-4">
                Инновационная образовательная платформа для изучения нефтегазовой отрасли. 
                Создаем доступную и современную образовательную среду для учащихся, 
                интересующихся нефтегазовой отраслью.
              </p>
              <p className="text-gray-600 mb-6">
                Мы стремимся к тому, чтобы каждый студент мог получить качественные знания 
                и практические навыки. Платформа "Югра.Нефть" объединяет лучшие образовательные 
                практики с современными технологиями для подготовки будущих специалистов.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-bold text-gray-900 mt-2">Цель</h3>
                  <p className="text-sm text-gray-600">Качественное образование</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-2xl">👥</span>
                  <h3 className="font-bold text-gray-900 mt-2">Аудитория</h3>
                  <p className="text-sm text-gray-600">Учащиеся и студенты</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <span className="text-2xl">📚</span>
                  <h3 className="font-bold text-gray-900 mt-2">Курсы</h3>
                  <p className="text-sm text-gray-600">7 направлений</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <span className="text-2xl">🏆</span>
                  <h3 className="font-bold text-gray-900 mt-2">Достижения</h3>
                  <p className="text-sm text-gray-600">Система мотивации</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Профессиональная ориентация</h3>
                <p className="text-gray-600">
                  Помогаем учащимся определиться с будущей профессией в нефтегазовой отрасли
                </p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Доступные материалы</h3>
                <p className="text-gray-600">
                  Все курсы и учебные материалы доступны бесплатно для всех учащихся
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Геймификация</h3>
                <p className="text-gray-600">
                  Система достижений и сертификатов делает обучение увлекательным
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Главный компонент страницы
const MainPage: React.FC<{
  onLogin: () => void;
  onRegister: () => void;
}> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogin={onLogin} onRegister={onRegister} />
      
      <main className="flex-grow">
        <HeroSection />
        <AboutProjectSection />
        <HowItWorksSection />
        <PartnersSection />
        <TestimonialsSection />
        <CtaSection onLogin={onLogin} onRegister={onRegister} />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainPage;
