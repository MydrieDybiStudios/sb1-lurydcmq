import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, GraduationCap, Info, X, Video, Headphones, Zap, Shield, Download, PlusCircle, MinusCircle } from "lucide-react";
import Footer from "../components/Footer";

// Импортируем фото для VR модулей
import znakomstvo from "../logos/znakomstvo.jpg";
import avaria from "../logos/osmotr.png";
import museum from "../logos/vr-museum.jpg";
import kach from "../logos/kach.jpg";
import poisk from "../logos/poisk.jpg";
import bur from "../logos/bur.jpg";
import lab from "../logos/lab.jpg";
import grp from "../logos/grp.png";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

const VRModule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Все VR модули как самостоятельные элементы (без progress)
  const vrModules = [
    {
      id: 1,
      title: "Знакомство",
      description: "Прохождение техники безопасности, Знакомство с виртуальным помощником.",
      duration: "5-10 минут",
      difficulty: "Начальный",
      image: znakomstvo,
      features: ["Техника Безопасности", "Интерактивные сценарии", "Виртуальный гид", "Знакомство"],
      type: "exploration",
      fullDescription: "Этот модуль познакомит вас с основами работы в виртуальной реальности и техникой безопасности. Вы встретитесь с виртуальным помощником, который проведет вас через все этапы обучения.",
      icon: Shield,
      downloadLink: "https://drive.google.com/uc?export=download&id=1Aqxwan_cBSG_N8tYHmzHltbOfE1xcWe1"
    },
    {
      id: 2,
      title: "Поиск месторождения",
      description: "Виртуальное путешествие по процессу поиска и разведки нефтяных месторождений. Изучите современные методы геологоразведки.",
      duration: "5-10 минут",
      difficulty: "Начальный",
      image: poisk,
      features: ["3D модели оборудования", "Интерактивные сценарии", "Виртуальный гид"],
      type: "exploration",
      fullDescription: "Исследуйте процесс поиска нефтяных месторождений с использованием современных технологий. Узнайте о методах геологоразведки и оборудовании, используемом для обнаружения запасов нефти.",
      icon: Zap,
      downloadLink: "#"
    },
    {
      id: 3,
      title: "Запуск буровой вышки",
      description: "Иммерсивный опыт запуска буровой установки. Управляйте процессом бурения в виртуальной реальности.",
      duration: "5-10 минут",
      difficulty: "Средний",
      image: bur,
      features: ["Симуляция управления", "Анимация процессов", "Техника безопасности"],
      type: "simulation",
      fullDescription: "Погрузитесь в процесс запуска буровой установки. Управляйте оборудованием, следите за показателями и осваивайте технику безопасности при работе с буровыми системами.",
      icon: Video,
      downloadLink: "https://drive.google.com/uc?export=download&id=13gMufgQRrydLFvxILjerEN6-LkZ_y9UK"
    },
    {
      id: 4,
      title: "Запуск насоса-качалки",
      description: "Виртуальная симуляция работы нефтедобывающего оборудования. Освойте принципы работы насосных станций.",
      duration: "5-10 минут",
      difficulty: "Средний",
      image: kach,
      features: ["Реалистичная физика", "Запуск качалки", "Процедуры устранения поломок"],
      type: "simulation",
      fullDescription: "Освойте работу насосных станций и принципы добычи нефти. Научитесь запускать и обслуживать насосы-качалки, а также устранять типичные неисправности.",
      icon: Play,
      downloadLink: "https://drive.google.com/uc?export=download&id=11ngwYVfCQkKEUO9X_CNFu_beOWgwm9uY"
    },
    {
      id: 5,
      title: "Осмотр месторождения",
      description: "Симуляция проверки обЪектов на месторождении",
      duration: "10-15 минут",
      difficulty: "Продвинутый",
      image: avaria,
      features: ["Процедуры фиксирования поломок", "Нарушение", "Проверка"],
      type: "interactive",
      fullDescription: "Проинспектируйте объекты на нефтяном месторождении.",
      icon: Zap,
      downloadLink: "https://drive.google.com/uc?export=download&id=1ZB7APzV_Ihysu8lqEMlP7S4yh3XELRII"
    },
    {
      id: 6,
      title: "Лаборатория",
      description: "Интерактивная лаборатория для исследования и анализа нефти. Проводите химические опыты в безопасной VR-среде.",
      duration: "5-10 минут",
      difficulty: "Продвинутый",
      image: lab,
      features: ["Виртуальные эксперименты", "Анализ проб", "Исследовательские задачи"],
      type: "interactive",
      fullDescription: "Проводите химические анализы и эксперименты с нефтью в полностью безопасной виртуальной лаборатории. Изучайте свойства нефти и методы ее исследования.",
      icon: Headphones,
      downloadLink: "https://drive.google.com/uc?export=download&id=1DojoPhlxO-jX47FWOqyJFy8cbBAkSlQs"
    },
    {
      id: 7,
      title: "VR музей нефти",
      description: "Оцифрованный музей имени Романа Ивановича Кузоваткина. Исследуйте интерактивные экспонаты и архивные материалы.",
      duration: "15-20 минут",
      difficulty: "Начальный",
      image: museum,
      features: ["Исторические реконструкции", "Интерактивные экспонаты", "3D хронология", "Виртуальный гид"],
      type: "educational",
      fullDescription: "Посетите виртуальный музей нефтяной промышленности. Изучите историю добычи нефти, интерактивные экспонаты и архивные материалы в immersive-среде.",
      icon: GraduationCap,
      downloadLink: "https://drive.google.com/uc?export=download&id=1M_ZkDNbqd_bXV53DQxoONcaDumFwQi0O"
    },
    {
      id: 8,
      title: "Гидроразрыв пласта",
      description: "Освойте основные действия при ГРП",
      duration: "15-20 минут",
      difficulty: "Продвинутый",
      image: grp,
      features: ["ГРП", "Закачка жидкости", "Технология"],
      type: "educational",
      fullDescription: "Симуляция действий при ГРП. Технология ГРП",
      icon: GraduationCap,
      downloadLink: "https://drive.google.com/uc?export=download&id=1LOvWiLIg3RGv_Pi1fuHL2vD7NrVJ6F2y"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Начальный": return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "Средний": return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "Продвинутый": return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
      default: return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exploration": return "🔍";
      case "simulation": return "🎮";
      case "interactive": return "🔄";
      case "educational": return "📚";
      default: return "🥽";
    }
  };

  const handleModuleDetails = (module: any) => {
    setSelectedModule(module);
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  // Блокировка скролла body при открытом модальном окне
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      {/* ===== HEADER ===== */}
      <header className="bg-black text-white shadow-2xl sticky top-0 z-40 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={logo}
                alt="Югра.Нефть"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-yellow-400">
                VR-модуль
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">Виртуальная реальность • Югра.Нефть</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/cabinet")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
          >
            ← Назад
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Виртуальная реальность
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Погрузитесь в мир нефтяной промышленности через
              <span className="font-semibold text-yellow-400"> иммерсивные VR-технологии</span>
            </p>
          </div>

          {/* VR Modules */}
          <div className="mb-16">
            {/* Горизонтальный скролл на мобильных, сетка на десктопе */}
            <div
              ref={scrollContainerRef}
              className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-auto pb-4 lg:overflow-visible lg:pb-0 scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-gray-800"
              style={{ scrollbarWidth: 'thin' }}
            >
              {vrModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[400px] lg:w-full group bg-gray-800 rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700 hover:border-yellow-500/30"
                  >
                    <div className="relative overflow-hidden">
                      <div
                        className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center cursor-pointer relative"
                        onClick={() => handleModuleDetails(module)}
                      >
                        {!imageLoaded[module.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={module.image}
                          alt={module.title}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            imageLoaded[module.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleImageLoad(module.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center space-x-2 mb-2">
                              <Info className="w-5 h-5 text-yellow-400" />
                              <span className="text-sm font-medium">Нажмите для подробностей</span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-500/30">
                          Модуль {module.id}
                        </div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                          <span>{getTypeIcon(module.type)}</span>
                          <span>VR</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                              {module.title}
                            </h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 mb-4 leading-relaxed line-clamp-2">
                        {module.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {module.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-3 py-2 rounded-xl border border-gray-600 font-medium">
                              {feature}
                            </span>
                          ))}
                          {module.features.length > 3 && (
                            <span className="text-xs bg-gray-700 text-gray-300 px-3 py-2 rounded-xl border border-gray-600 font-medium">
                              +{module.features.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                            <div className="text-sm font-semibold text-white">{module.duration}</div>
                            <div className="text-xs text-gray-500">Длительность</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <a
                            href={module.downloadLink}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                            title="Скачать сцену"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => handleModuleDetails(module)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-500 transform hover:scale-105 flex items-center shadow-lg hover:shadow-yellow-500/25"
                          >
                            <Info className="w-5 h-5 mr-2" />
                            Подробнее
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VR Equipment Info */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl"></div>
            <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-3xl p-12 text-center text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full"></div>
              </div>

              <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Готовы к погружению в VR?
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-yellow-100 leading-relaxed">
                  Испытайте профессию нефтяника на себе в виртуальной реальности
                </p>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-6 text-2xl">Рекомендации для VR:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Свободное пространство 2x2 м</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Стабильное интернет-соединение</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Комфортный VR-шлем</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Перерывы каждые 30 минут</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Menu */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 inline-flex items-center shadow-2xl border border-yellow-500/20"
            >
              Вернуться в главное меню
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal for Module Details */}
      {isModalOpen && selectedModule && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-6xl max-h-[90vh] w-full animate-scaleIn">
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden border border-yellow-500/20 shadow-2xl flex flex-col max-h-[90vh]">
              {/* Кнопка закрытия справа вверху */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-30 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm border border-yellow-500/30"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Тег VR модуль слева вверху */}
              <div className="absolute top-6 left-6 z-30 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                <span>{getTypeIcon(selectedModule.type)}</span>
                <span>VR Модуль</span>
              </div>

              <div className="p-8 overflow-y-auto flex-grow">
                {/* Header (с отступом сверху, чтобы не наезжать на теги) */}
                <div className="flex items-start justify-between mb-8 mt-12">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {selectedModule.icon && <selectedModule.icon className="w-8 h-8 text-black" />}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedModule.title}</h2>
                      <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getDifficultyColor(selectedModule.difficulty)}`}>
                        {selectedModule.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image with zoom controls */}
                <div className="relative rounded-2xl overflow-hidden mb-8 border border-yellow-500/20">
                  <div className="absolute top-4 right-4 flex space-x-2 z-20">
                    <button
                      onClick={handleZoomIn}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-2 shadow-lg transition-all duration-200"
                      title="Увеличить"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-2 shadow-lg transition-all duration-200"
                      title="Уменьшить"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-center bg-black p-4 overflow-auto max-h-80">
                    <img
                      src={selectedModule.image}
                      alt={selectedModule.title}
                      style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm border border-yellow-500/30">
                    Модуль {selectedModule.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Описание модуля</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">{selectedModule.fullDescription}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Особенности</h3>
                      <div className="space-y-3">
                        {selectedModule.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-300 text-lg">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Details */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Детали модуля</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-6 h-6 text-yellow-400" />
                            <span className="text-gray-300 text-lg">Длительность</span>
                          </div>
                          <span className="text-white font-semibold text-lg">{selectedModule.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Download Link */}
                    <a
                      href={selectedModule.downloadLink}
                      className="block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center text-lg shadow-lg"
                    >
                      <Download className="inline-block w-5 h-5 mr-2" />
                      Скачать сцену
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRModule;