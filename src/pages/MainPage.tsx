import React, { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";
import { Compass, X, Home, Users, BookOpen, Award, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Импорты логотипов из папки src/logos/
import school1Logo from "../logos/school1-logo.png";
import educationDepartmentLogo from "../logos/education-department-logo.png";
import rnYuganskLogo from "../logos/rn-yugansk-logo.png";

// Компонент путеводителя для мобильных устройств
const MobileGuide: React.FC = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const guideItems = [
    { icon: Home, label: "Главная", action: () => navigate("/") },
    { icon: BookOpen, label: "О проекте", action: () => scrollToSection("about") },
    { icon: Users, label: "Как работает", action: () => scrollToSection("how-it-works") },
    { icon: Award, label: "Партнёры", action: () => scrollToSection("partners") },
    { icon: MessageCircle, label: "Контакты", action: () => scrollToSection("cta") }
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsGuideOpen(false);
  };

  return (
    <>
      {/* Кнопка открытия путеводителя - УВЕЛИЧЕНА */}
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-4 shadow-2xl lg:hidden transition-all duration-300 hover:scale-110"
        aria-label="Открыть навигацию"
        style={{ width: '60px', height: '60px' }}
      >
        <Compass className="w-7 h-7" />
      </button>

      {/* Модальное окно путеводителя */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Быстрая навигация</h3>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {guideItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <IconComponent className="w-6 h-6 text-yellow-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
    <section id="how-it-works" className="py-8 md:py-16 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Как работает платформа</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Простой и понятный процесс обучения, который поможет вам освоить основы нефтегазовой отрасли
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 text-center hover:shadow-lg sm:hover:shadow-xl transition-shadow w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-sm sm:text-xl">{step.number}</span>
              </div>
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">{step.icon}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{step.description}</p>
              
              <ul className="text-xs sm:text-sm text-gray-500 text-left space-y-1 sm:space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg w-full">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8">Преимущества нашей платформы</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm sm:text-base">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Бесплатный доступ</h4>
                <p className="text-gray-600 text-sm sm:text-base">Все курсы доступны совершенно бесплатно для учащихся</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm sm:text-base">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Сертификаты</h4>
                <p className="text-gray-600 text-sm sm:text-base">Получайте именные сертификаты о прохождении курсов</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-bold text-sm sm:text-base">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Геймификация</h4>
                <p className="text-gray-600 text-sm sm:text-base">Система достижений делает обучение увлекательным</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-red-600 font-bold text-sm sm:text-base">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Практические знания</h4>
                <p className="text-gray-600 text-sm sm:text-base">Курсы разработаны при участии industry-экспертов</p>
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

  // Функция для открытия формы партнерства
  const handlePartnerForm = () => {
    window.open('https://forms.yandex.ru/u/68efb425e010db1cab0dd08b', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="partners" className="py-8 md:py-16 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Наши партнёры</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Совместными усилиями мы создаём качественное образование для будущего нефтегазовой отрасли
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-16">
          {partners.map((partner, index) => (
            <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 text-center hover:shadow-lg sm:hover:shadow-xl transition-shadow w-full">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={`Логотип ${partner.name}`}
                  className={`object-contain ${
                    partner.name === "РН-Юганскнефтегаз" 
                      ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" 
                      : "w-14 h-14 sm:w-16 sm:h-16"
                  }`}
                />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
              
              <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${
                partner.type.includes("Информационный") 
                  ? "bg-blue-100 text-blue-800"
                  : partner.type.includes("Образовательный")
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-800"
              }`}>
                {partner.type}
              </span>
              
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center text-white w-full">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Станьте нашим партнёром</h3>
          <p className="text-yellow-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Мы открыты для сотрудничества с образовательными учреждениями и компаниями нефтегазовой отрасли
          </p>
          <button 
            onClick={handlePartnerForm}
            className="bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 sm:py-3 sm:px-8 rounded-lg transition text-sm sm:text-base"
          >
            Связаться с нами
          </button>
        </div>
      </div>
    </section>
  );
};

const AboutProjectSection: React.FC = () => {
  return (
    <section id="about" className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-yellow-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 md:p-12 w-full border border-yellow-100">
          {/* Заголовок */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Цифровая образовательная среда <span className="text-yellow-600">«ЮГРА.НЕФТЬ»</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">
              Инновационная платформа, объединяющая обучение, профориентацию и музейную экспозицию
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Левая колонка - основная информация */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Авторы проекта</h3>
                <p className="text-gray-700">
                  Пестриков Кирилл Валерьевич и Морозов Антон Павлович,<br />
                  учащиеся 10А Роснефть-класса МБОУ «Средняя общеобразовательная школа № 1» пгт. Пойковский
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Научный руководитель</h3>
                <p className="text-gray-700">Рахманов Александр Валерьевич</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Место реализации</h3>
                <p className="text-gray-700">
                  Музей нефти имени Романа Ивановича Кузоваткина,<br />
                  школа № 1, пгт. Пойковский, Ханты-Мансийский автономный округ — Югра
                </p>
              </div>

              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Цифровая образовательная среда «ЮГРА.НЕФТЬ»</strong> — это инновационная платформа, 
                  объединяющая обучение, профориентацию и музейную экспозицию. Проект разработан школьниками 
                  для школьников и направлен на то, чтобы сделать процесс изучения нефтегазовой отрасли 
                  современным, наглядным и интерактивным.
                </p>
              </div>
            </div>

            {/* Правая колонка - цели и особенности */}
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Цели проекта</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span>Повышение интереса учащихся к нефтегазовой отрасли и инженерным специальностям</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span>Создание современной интерактивной платформы на базе школьного музея</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span>Формирование практических знаний о добыче, переработке и транспортировке нефти и газа</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span>Развитие профориентационной активности школьников и помощь в выборе профессии</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Технологии</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>VR технологии</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>AR приложения</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span>Геймификация</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <span>Веб-портал</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-white">
                <h3 className="font-bold mb-2">Основной образовательный ресурс</h3>
                <p className="text-yellow-100 text-sm">ugra-oil.vercel.app</p>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Результаты внедрения</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Тестирование среди учащихся 8–11 классов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Повышение вовлечённости и интереса к нефтегазовой тематике</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Более высокие результаты по тематическим тестам</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Перспективы развития</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">→</span>
                  <span>Внедрение в профильные Роснефть-классы</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">→</span>
                  <span>Новые модули по геологии и экологии</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">→</span>
                  <span>Интеграция с системами дистанционного обучения</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Заключение */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 italic text-sm sm:text-base">
              Цифровая образовательная среда «ЮГРА.НЕФТЬ» — пример того, как школьная инициатива и современные 
              технологии VR/AR могут объединить музей, образование и инновации, открывая новое поколение для 
              профессий нефтегазовой отрасли.
            </p>
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
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header onLogin={onLogin} onRegister={onRegister} />
      
      <main className="flex-grow w-full">
        <HeroSection />
        <CtaSection onLogin={onLogin} onRegister={onRegister} />
        <AboutProjectSection />
        <HowItWorksSection />
        <PartnersSection />
        {/* TestimonialsSection удален с главной страницы */}
      </main>
      
      {/* Путеводитель для мобильных устройств */}
      <MobileGuide />
      
      <Footer />
    </div>
  );
};

export default MainPage;
