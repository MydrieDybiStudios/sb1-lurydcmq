import React, { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";
import { 
  Compass, X, Home, Users, BookOpen, Award, MessageCircle, 
  Sparkles, Target, Zap, Rocket, Globe, ChevronRight, 
  GraduationCap, Video, CheckCircle, Trophy, Eye, ArrowRight,
  User, Mail, Lock, Heart, Star, Layers, Cpu, Brain, 
  TrendingUp, BarChart, Clock, ThumbsUp, Share2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Импорты логотипов
import school1Logo from "../logos/school1-logo.png";
import educationDepartmentLogo from "../logos/education-department-logo.png";
import rnYuganskLogo from "../logos/rn-yugansk-logo.png";
import varwinLogo from "../logos/varwin-logo.png";

// ================== Мобильный путеводитель (стиль hero) ==================
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
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-black text-yellow-400 hover:bg-gray-900 rounded-full p-4 shadow-2xl lg:hidden transition-all duration-300 hover:scale-110 border-2 border-black"
        style={{ width: '60px', height: '60px' }}
      >
        <Compass className="w-7 h-7" />
      </button>

      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsGuideOpen(false)} />
          <div className="relative w-full bg-black rounded-t-3xl p-6 animate-slide-up border-t border-yellow-500/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-yellow-400">Быстрая навигация</h3>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-gray-400 hover:text-yellow-400 transition"
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
                    className="group flex flex-col items-center p-4 bg-gray-900 rounded-2xl border border-gray-800 hover:border-yellow-500 transition-all hover:scale-105"
                  >
                    <div className="bg-yellow-500/10 rounded-full p-3 mb-2 group-hover:bg-yellow-500/20 transition">
                      <IconComponent className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{item.label}</span>
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

// ================== Секция "Как работает" (стиль hero) ==================
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: <User className="w-6 h-6" />,
      title: "Регистрация",
      description: "Создайте аккаунт и укажите ваш класс или образовательное учреждение",
      details: ["Быстрая регистрация через email", "Указание класса/курса", "Создание личного профиля"],
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "2",
      icon: <BookOpen className="w-6 h-6" />,
      title: "Выбор курса",
      description: "Выберите подходящий курс по нефтегазовой тематике из нашего каталога",
      details: ["7 основных курсов", "Разные уровни сложности", "Постепенное изучение"],
      color: "from-green-500 to-green-600"
    },
    {
      number: "3",
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Обучение",
      description: "Проходите интерактивные уроки, изучайте материалы и выполняйте задания",
      details: ["Интерактивные материалы", "Практические задания", "Пошаговое изучение"],
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "4",
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Тестирование",
      description: "Пройдите итоговый тест для проверки полученных знаний",
      details: ["Контрольные вопросы", "Минимальный порог - 70%", "Неограниченное количество попыток"],
      color: "from-red-500 to-red-600"
    },
    {
      number: "5",
      icon: <Trophy className="w-6 h-6" />,
      title: "Достижения",
      description: "Получайте достижения и сертификаты за успешное прохождение курсов",
      details: ["Система достижений", "Именные сертификаты", "Прогресс обучения"],
      color: "from-yellow-500 to-yellow-600"
    },
    {
      number: "6",
      icon: <Users className="w-6 h-6" />,
      title: "Сообщество",
      description: "Присоединяйтесь к образовательному сообществу и делитесь успехами",
      details: ["Обмен опытом", "Совместные проекты", "Поддержка преподавателей"],
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const advantages = [
    { icon: <Zap className="w-5 h-5" />, title: "Бесплатный доступ", desc: "Все курсы доступны совершенно бесплатно для учащихся", color: "text-green-400", bg: "bg-green-500/20" },
    { icon: <Award className="w-5 h-5" />, title: "Сертификаты", desc: "Получайте именные сертификаты о прохождении курсов", color: "text-blue-400", bg: "bg-blue-500/20" },
    { icon: <Target className="w-5 h-5" />, title: "Геймификация", desc: "Система достижений делает обучение увлекательным", color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: <Brain className="w-5 h-5" />, title: "Практические знания", desc: "Курсы разработаны при участии industry-экспертов", color: "text-red-400", bg: "bg-red-500/20" },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Волнистый чёрный элемент внизу (как в HeroSection) */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Чёрная полоска вверху */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">Как работает платформа</h2>
          <p className="text-xl text-black/80 max-w-3xl mx-auto">
            Простой и понятный процесс обучения, который поможет вам освоить основы нефтегазовой отрасли
          </p>
        </div>

        {/* Сетка шагов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition">
                {step.title}
              </h3>
              <p className="text-gray-300 mb-4 text-sm">{step.description}</p>

              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-400">
                    <ChevronRight className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Преимущества */}
        <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
          <h3 className="text-2xl font-bold text-yellow-400 text-center mb-8">Преимущества нашей платформы</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-black/40 border border-yellow-500/20 hover:border-yellow-400 transition group">
                <div className={`w-12 h-12 rounded-xl ${adv.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                  <div className={adv.color}>{adv.icon}</div>
                </div>
                <h4 className="font-bold text-white mb-1">{adv.title}</h4>
                <p className="text-sm text-gray-400">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ================== Секция партнёров (стиль hero) ==================
const PartnersSection: React.FC = () => {
  const partners = [
    {
      name: "МОБУ СОШ №1",
      type: "Образовательный партнёр",
      description: "Ведущая общеобразовательная школа Нефтеюганского района",
      logo: school1Logo,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-400"
    },
    {
      name: "Департамент Образования",
      type: "Организационный партнёр",
      description: "Координатор образовательных инициатив и программ в районе",
      logo: educationDepartmentLogo,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400"
    },
    {
      name: "РН-Юганскнефтегаз",
      type: "Информационный партнёр",
      description: "Ведущее нефтегазодобывающее предприятие региона",
      logo: rnYuganskLogo,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400"
    },
    {
      name: "Varwin",
      type: "Технический партнёр",
      description: "Платформа для создания VR-решений без программирования",
      logo: varwinLogo,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400"
    }
  ];

  const handlePartnerForm = () => {
    window.open('https://forms.yandex.ru/u/68efb425e010db1cab0dd08b', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="partners" className="relative py-24 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Волнистый чёрный элемент внизу */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Чёрная полоска вверху */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">Наши партнёры</h2>
          <p className="text-xl text-black/80 max-w-3xl mx-auto">
            Совместными усилиями мы создаём качественное образование для будущего нефтегазовой отрасли
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="flex justify-center mb-4">
                <div className={`w-24 h-24 rounded-2xl ${partner.bgColor} border ${partner.borderColor} flex items-center justify-center p-3 group-hover:scale-110 transition`}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-yellow-400 text-center mb-2 group-hover:text-yellow-300 transition">
                {partner.name}
              </h3>

              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${partner.bgColor} ${partner.textColor} border ${partner.borderColor}`}>
                  {partner.type}
                </span>
              </div>

              <p className="text-sm text-gray-300 text-center leading-relaxed">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Блок сотрудничества */}
        <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-12 text-center relative overflow-hidden border border-yellow-500/20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-6 shadow-2xl border border-yellow-500/30 animate-bounce">
              <Heart className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">Станьте нашим партнёром</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Мы открыты для сотрудничества с образовательными учреждениями и компаниями нефтегазовой отрасли
            </p>
            <button 
              onClick={handlePartnerForm}
              className="group bg-black text-yellow-400 hover:bg-gray-900 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 border-2 border-black"
            >
              <span>Связаться с нами</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ================== Секция "О проекте" (стиль hero) ==================
const AboutProjectSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Волнистый чёрный элемент внизу */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Чёрная полоска вверху */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-black">Цифровая образовательная среда</h1>
            <p className="text-2xl font-bold text-black/80">«ЮГРА.НЕФТЬ»</p>
            <p className="text-lg text-black/70 mt-4 max-w-2xl mx-auto">
              Инновационная платформа, объединяющая обучение, профориентацию и музейную экспозицию
            </p>
          </div>

          {/* Основной контент в виде карточек */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Авторы */}
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Авторы проекта</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                <span className="font-semibold text-yellow-400">Пестриков Кирилл Валерьевич</span> и{' '}
                <span className="font-semibold text-yellow-400">Морозов Антон Павлович</span>,<br />
                учащиеся 10А Роснефть-класса МБОУ «СОШ №1» пгт. Пойковский
              </p>
            </div>

            {/* Научный руководитель */}
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Научный руководитель</h3>
              </div>
              <p className="text-gray-300 text-lg">
                <span className="font-semibold text-yellow-400">Рахманов Александр Валерьевич</span>
              </p>
            </div>

            {/* Место реализации */}
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Место реализации</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Музей нефти имени Романа Ивановича Кузоваткина,<br />
                школа №1, пгт. Пойковский, ХМАО — Югра
              </p>
            </div>

            {/* Технологии */}
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Технологии</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["VR технологии", "AR приложения", "Геймификация", "Веб-портал"].map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Цели проекта */}
          <div className="mt-6 bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20 hover:border-yellow-400 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-400">Цели проекта</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Повышение интереса учащихся к нефтегазовой отрасли и инженерным специальностям",
                "Создание современной интерактивной платформы на базе школьного музея",
                "Формирование практических знаний о добыче, переработке и транспортировке нефти и газа",
                "Развитие профориентационной активности школьников и помощь в выборе профессии"
              ].map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-black/40 rounded-xl">
                  <span className="text-yellow-400 font-bold text-lg">{idx+1}.</span>
                  <p className="text-gray-300 text-sm">{goal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Результаты и перспективы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Результаты внедрения
              </h3>
              <ul className="space-y-3">
                {[
                  "Тестирование среди учащихся 8–11 классов",
                  "Повышение вовлечённости и интереса к нефтегазовой тематике",
                  "Более высокие результаты по тематическим тестам"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-400" />
                Перспективы развития
              </h3>
              <ul className="space-y-3">
                {[
                  "Внедрение в профильные Роснефть-классы",
                  "Новые модули по геологии и экологии",
                  "Интеграция с системами дистанционного обучения"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">→</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Заключение */}
          <div className="mt-8 p-8 bg-black/80 backdrop-blur-sm rounded-3xl border border-yellow-500/20 text-center">
            <p className="text-gray-300 italic leading-relaxed">
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

// ================== Главная страница ==================
const MainPage: React.FC<{
  onLogin: () => void;
  onRegister: () => void;
}> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogin={onLogin} onRegister={onRegister} />
      
      <main className="flex-grow">
        <HeroSection />
        <CtaSection onLogin={onLogin} onRegister={onRegister} />
        <AboutProjectSection />
        <HowItWorksSection />
        <PartnersSection />
      </main>
      
      <MobileGuide />
      <Footer />
    </div>
  );
};

export default MainPage;
