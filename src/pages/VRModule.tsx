import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Award, Star, Users, BarChart3, GraduationCap, Info, X, Video, Headphones, Zap, Shield } from "lucide-react";
import Footer from "../components/Footer";

// Импортируем фото для VR модулей
import znakomstvo from "../logos/znakomstvo.jpg";
import avaria from "../logos/avaria.jpg";
import museum from "../logos/vr-museum.jpg";
import kach from "../logos/kach.jpg";
import poisk from "../logos/poisk.jpg";
import bur from "../logos/bur.jpg";
import lab from "../logos/lab.jpg";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

const VRModule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{[key: string]: boolean}>({});

  // Все VR модули как самостоятельные элементы
  const vrModules = [
    {
      id: 1,
      title: "Знакомство",
      description: "Прохождение техники безопасности, Знакомство с виртуальным помощником.",
      duration: "5-10 минут",
      difficulty: "Начальный",
      progress: 0,
      image: znakomstvo,
      features: ["Техника Безопасности", "Интерактивные сценарии", "Виртуальный гид", "Знакомство"],
      type: "exploration",
      fullDescription: "Этот модуль познакомит вас с основами работы в виртуальной реальности и техникой безопасности. Вы встретитесь с виртуальным помощником, который проведет вас через все этапы обучения.",
      icon: Shield
    },
    {
      id: 2,
      title: "Поиск месторождения",
      description: "Виртуальное путешествие по процессу поиска и разведки нефтяных месторождений. Изучите современные методы геологоразведки.",
      duration: "5-10 минут",
      difficulty: "Начальный",
      progress: 0,
      image: poisk,
      features: ["3D модели оборудования", "Интерактивные сценарии", "Виртуальный гид"],
      type: "exploration",
      fullDescription: "Исследуйте процесс поиска нефтяных месторождений с использованием современных технологий. Узнайте о методах геологоразведки и оборудовании, используемом для обнаружения запасов нефти.",
      icon: Zap
    },
    {
      id: 3,
      title: "Запуск буровой вышки",
      description: "Иммерсивный опыт запуска буровой установки. Управляйте процессом бурения в виртуальной реальности.",
      duration: "5-10 минут",
      difficulty: "Средний",
      progress: 0,
      image: bur,
      features: ["Симуляция управления", "Анимация процессов", "Техника безопасности"],
      type: "simulation",
      fullDescription: "Погрузитесь в процесс запуска буровой установки. Управляйте оборудованием, следите за показателями и осваивайте технику безопасности при работе с буровыми системами.",
      icon: Video
    },
    {
      id: 4,
      title: "Запуск насоса-качалки",
      description: "Виртуальная симуляция работы нефтедобывающего оборудования. Освойте принципы работы насосных станций.",
      duration: "5-10 минут",
      difficulty: "Средний",
      progress: 0,
      image: kach,
      features: ["Реалистичная физика", "Запуск качалки", "Процедуры устранения поломок"],
      type: "simulation",
      fullDescription: "Освойте работу насосных станций и принципы добычи нефти. Научитесь запускать и обслуживать насосы-качалки, а также устранять типичные неисправности.",
      icon: Play
    },
    {
      id: 5,
      title: "Авария на месторождении",
      description: "Симуляция устранения аварии на месторождении",
      duration: "10-15 минут",
      difficulty: "Продвинутый",
      progress: 0,
      image: avaria,
      features: ["Процедуры устранения поломок", "Сварка", "Техническое обслуживание"],
      type: "interactive",
      fullDescription: "Отработайте действия в аварийной ситуации на нефтяном месторождении. Освойте процедуры устранения поломок, технику безопасности и методы быстрого реагирования.",
      icon: Zap
    },
    {
      id: 6,
      title: "Лаборатория",
      description: "Интерактивная лаборатория для исследования и анализа нефти. Проводите химические опыты в безопасной VR-среде.",
      duration: "5-10 минут",
      difficulty: "Продвинутый",
      progress: 0,
      image: lab,
      features: ["Виртуальные эксперименты", "Анализ проб", "Исследовательские задачи"],
      type: "interactive",
      fullDescription: "Проводите химические анализы и эксперименты с нефтью в полностью безопасной виртуальной лаборатории. Изучайте свойства нефти и методы ее исследования.",
      icon: Headphones
    },
    {
      id: 7,
      title: "VR музей нефти",
      description: "Оцифрованный музей имени Романа Ивановича Кузоваткина. Исследуйте интерактивные экспонаты и архивные материалы.",
      duration: "15-20 минут",
      difficulty: "Начальный",
      progress: 0,
      image: museum,
      features: ["Исторические реконструкции", "Интерактивные экспонаты", "3D хронология", "Виртуальный гид"],
      type: "educational",
      fullDescription: "Посетите виртуальный музей нефтяной промышленности. Изучите историю добычи нефти, интерактивные экспонаты и архивные материалы в immersive-среде.",
      icon: GraduationCap
    }
  ];

  // Пример заполненной статистики (для демонстрации)
  const exampleStats = [
    { label: "Общее время", value: "127 минут", icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Средний балл", value: "87%", icon: Award, color: "from-green-500 to-emerald-500" },
    { label: "Пройдено модулей", value: "3 из 7", icon: BarChart3, color: "from-purple-500 to-pink-500" },
    { label: "Достижения", value: "7 из 15", icon: Star, color: "from-yellow-500 to-orange-500" },
    { label: "Попыток", value: "12", icon: Users, color: "from-orange-500 to-red-500" },
    { label: "Прогресс", value: "43%", icon: GraduationCap, color: "from-red-500 to-rose-500" }
  ];

  // Пустая статистика
  const emptyStats = [
    { label: "Общее время", value: "0 минут", icon: Clock, color: "from-gray-500 to-gray-600" },
    { label: "Средний балл", value: "0%", icon: Award, color: "from-gray-500 to-gray-600" },
    { label: "Пройдено модулей", value: "0 из 7", icon: BarChart3, color: "from-gray-500 to-gray-600" },
    { label: "Достижения", value: "0 из 15", icon: Star, color: "from-gray-500 to-gray-600" },
    { label: "Попыток", value: "0", icon: Users, color: "from-gray-500 to-gray-600" },
    { label: "Прогресс", value: "0%", icon: GraduationCap, color: "from-gray-500 to-gray-600" }
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ===== HEADER ===== */}
      <header className="bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl sticky top-0 z-40">
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
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                VR-модуль
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">Виртуальная реальность • Югра.Нефть</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/cabinet")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-2xl">
              <div className="text-2xl">🥽</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-800 to-purple-800 bg-clip-text text-transparent">
              Виртуальная реальность
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Погрузитесь в мир нефтяной промышленности через 
              <span className="font-semibold text-purple-600"> иммерсивные VR-технологии</span>
            </p>
          </div>

          {/* Demo Info */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 mb-12 text-center text-white shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Info className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold">Демонстрационная версия</h2>
              </div>
              <p className="text-xl opacity-90 leading-relaxed">
                На этой странице представлены демонстрационные данные. Статистика и прогресс модулей 
                будут работать в ближайшем будущем после подключения системы отслеживания.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ваша статистика</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Отслеживайте ваш прогресс в виртуальной реальности
              </p>
            </div>

            {/* Current Stats */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Текущая статистика</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {emptyStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="group bg-white rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20">
                      <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Example Stats */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Пример статистики (будет доступно в будущем)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {exampleStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="group bg-white rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-200">
                      <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* VR Modules */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">VR Модули</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                7 иммерсивных модулей виртуальной реальности для практического обучения
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {vrModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div 
                    key={module.id}
                    className="group bg-white rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-purple-200/30"
                  >
                    <div className="relative overflow-hidden">
                      <div 
                        className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer relative"
                        onClick={() => handleModuleDetails(module)}
                      >
                        {!imageLoaded[module.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center space-x-2 mb-2">
                              <Info className="w-5 h-5" />
                              <span className="text-sm font-medium">Нажмите для подробностей</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                          Модуль {module.id}
                        </div>
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-semibold">
                          {getTypeIcon(module.type)} VR
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {module.title}
                            </h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {module.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-200 font-medium">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Details and Progress */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm font-semibold text-gray-900">{module.duration}</div>
                            <div className="text-xs text-gray-500">Длительность</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900 mb-1">{module.progress}%</div>
                            <div className="text-xs text-gray-500">Прогресс</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleModuleDetails(module)}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-500 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                        >
                          <Info className="w-5 h-5 mr-2" />
                          Подробнее
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Прогресс прохождения</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${module.progress}%` }}
                          ></div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 rounded-3xl shadow-2xl"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 rounded-3xl p-12 text-center text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full"></div>
              </div>
              
              <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <div className="text-3xl">🥽</div>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Готовы к погружению в VR?
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
                  Испытайте профессию нефтяника на себе в виртуальной реальности
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-6 text-2xl">Рекомендации для VR:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Свободное пространство 2x2 м</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Стабильное интернет-соединение</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span>Комфортный VR-шлем</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
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
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 inline-flex items-center shadow-2xl hover:shadow-3xl"
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
          <div className="max-w-6xl max-h-full w-full animate-scaleIn">
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-10 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {selectedModule.icon && <selectedModule.icon className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedModule.title}</h2>
                      <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getDifficultyColor(selectedModule.difficulty)}`}>
                        {selectedModule.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                      {getTypeIcon(selectedModule.type)} VR Модуль
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
                  <img
                    src={selectedModule.image}
                    alt={selectedModule.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm">
                    Модуль {selectedModule.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-4">Описание модуля</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">{selectedModule.fullDescription}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Особенности</h3>
                      <div className="space-y-3">
                        {selectedModule.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-3 bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-200 text-lg">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Details */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                      <h3 className="text-2xl font-bold text-white mb-4">Детали модуля</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="text-gray-300 text-lg">Длительность</span>
                          </div>
                          <span className="text-white font-semibold text-lg">{selectedModule.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GraduationCap className="w-6 h-6 text-green-400" />
                            <span className="text-gray-300 text-lg">Прогресс</span>
                          </div>
                          <span className="text-white font-semibold text-lg">{selectedModule.progress}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-4">Прогресс прохождения</h3>
                      <div className="flex justify-between text-gray-300 mb-3 text-lg">
                        <span>Завершено</span>
                        <span>{selectedModule.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${selectedModule.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={closeModal}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                  >
                    Закрыть
                  </button>
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
