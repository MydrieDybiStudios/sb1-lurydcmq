import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Award, Star, Users, BarChart3, GraduationCap, Info, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      fullDescription: "Этот модуль познакомит вас с основами работы в виртуальной реальности и техникой безопасности. Вы встретитесь с виртуальным помощником, который проведет вас через все этапы обучения."
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
      fullDescription: "Исследуйте процесс поиска нефтяных месторождений с использованием современных технологий. Узнайте о методах геологоразведки и оборудовании, используемом для обнаружения запасов нефти."
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
      fullDescription: "Погрузитесь в процесс запуска буровой установки. Управляйте оборудованием, следите за показателями и осваивайте технику безопасности при работе с буровыми системами."
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
      fullDescription: "Освойте работу насосных станций и принципы добычи нефти. Научитесь запускать и обслуживать насосы-качалки, а также устранять типичные неисправности."
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
      fullDescription: "Отработайте действия в аварийной ситуации на нефтяном месторождении. Освойте процедуры устранения поломок, технику безопасности и методы быстрого реагирования."
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
      fullDescription: "Проводите химические анализы и эксперименты с нефтью в полностью безопасной виртуальной лаборатории. Изучайте свойства нефти и методы ее исследования."
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
      fullDescription: "Посетите виртуальный музей нефтяной промышленности. Изучите историю добычи нефти, интерактивные экспонаты и архивные материалы в immersive-среде."
    }
  ];

  // Пример заполненной статистики (для демонстрации)
  const exampleStats = [
    { label: "Общее время", value: "127 минут", icon: Clock, color: "text-blue-600" },
    { label: "Средний балл", value: "87%", icon: Award, color: "text-green-600" },
    { label: "Пройдено модулей", value: "3 из 7", icon: BarChart3, color: "text-purple-600" },
    { label: "Достижения", value: "7 из 15", icon: Star, color: "text-yellow-600" },
    { label: "Попыток", value: "12", icon: Users, color: "text-orange-600" },
    { label: "Прогресс", value: "43%", icon: GraduationCap, color: "text-red-600" }
  ];

  // Пустая статистика
  const emptyStats = [
    { label: "Общее время", value: "0 минут", icon: Clock, color: "text-blue-600" },
    { label: "Средний балл", value: "0%", icon: Award, color: "text-green-600" },
    { label: "Пройдено модулей", value: "0 из 7", icon: BarChart3, color: "text-purple-600" },
    { label: "Достижения", value: "0 из 15", icon: Star, color: "text-yellow-600" },
    { label: "Попыток", value: "0", icon: Users, color: "text-orange-600" },
    { label: "Прогресс", value: "0%", icon: GraduationCap, color: "text-red-600" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Начальный": return "bg-green-100 text-green-800 border-green-200";
      case "Средний": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Продвинутый": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== HEADER (как в личном кабинете) ===== */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* КРУГЛЫЙ ЛОГОТИП */}
            <img 
              src={logo} 
              alt="Югра.Нефть" 
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold">VR-модуль — Югра.Нефть</h1>
              <p className="text-xs text-gray-300 hidden md:block">Иммерсивное обучение в виртуальной реальности</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/cabinet")}
              className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
            >
              Вернуться в кабинет
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">VR-модуль</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              7 самостоятельных модулей виртуальной реальности для получения практических знаний
            </p>
          </div>

          {/* Информация о демо-статистике */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Демонстрационная версия</h3>
                <p className="text-yellow-700">
                  На этой странице представлены демонстрационные данные. Статистика и прогресс модулей будут работать в ближайшем будущем после подключения системы отслеживания.
                </p>
              </div>
            </div>
          </div>

          {/* Пустая статистика */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Текущая статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {emptyStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Пример заполненной статистики */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Пример статистики (будет доступно в будущем)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {exampleStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-200">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VR Модули */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">VR Модули</h2>
              <p className="text-gray-600">
                Выберите модуль для ознакомления с виртуальной реальности. Все модули в будущем будут доступны для прохождения.
              </p>
            </div>

            {vrModules.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-yellow-300 transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  {/* Изображение модуля */}
                  <div className="lg:w-1/3">
                    <div className="aspect-video lg:aspect-square lg:h-full relative overflow-hidden">
                      <img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                        Модуль {module.id}
                      </div>
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {getTypeIcon(module.type)} VR
                      </div>
                    </div>
                  </div>

                  {/* Информация о модуле */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{module.title}</h3>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getDifficultyColor(module.difficulty)}`}>
                            {module.difficulty}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">{module.description}</p>

                        {/* Особенности модуля */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Особенности модуля:</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.features.map((feature, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Детали модуля */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-gray-900">{module.duration}</div>
                            <div className="text-xs text-gray-600">Длительность</div>
                          </div>
                          <div className="text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-gray-900">{module.progress}%</div>
                            <div className="text-xs text-gray-600">Прогресс</div>
                          </div>
                        </div>
                      </div>

                      {/* Прогресс и кнопка */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Прогресс прохождения</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleModuleDetails(module)}
                          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center"
                        >
                          <Info className="w-5 h-5 mr-2" />
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Информация о VR-оборудовании */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mt-12 text-white">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Готовы к погружению в VR?</h3>
              <p className="text-blue-100 text-center">Испытайте профессию нефтяника на себе в виртуальной реальности</p>
            </div>
            <div className="flex justify-center">
              <div className="text-center max-w-2xl">
                <h4 className="font-semibold mb-4 text-lg">Рекомендации:</h4>
                <ul className="space-y-2 text-blue-100 text-lg">
                  <li>• Свободное пространство 2x2 м</li>
                  <li>• Стабильное интернет-соединение</li>
                  <li>• Комфортный VR-шлем</li>
                  <li>• Перерывы каждые 30 минут</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Кнопка возврата */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
            >
              Вернуться в меню
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Модальное окно для деталей модуля */}
      {isModalOpen && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Кнопка закрытия */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Изображение модуля */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedModule.image}
                  alt={selectedModule.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  Модуль {selectedModule.id}
                </div>
                <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  {getTypeIcon(selectedModule.type)} VR
                </div>
              </div>

              {/* Содержимое модального окна */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedModule.title}</h2>
                    <p className="text-gray-600 text-lg">{selectedModule.description}</p>
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getDifficultyColor(selectedModule.difficulty)} mt-2 md:mt-0`}>
                    {selectedModule.difficulty}
                  </span>
                </div>

                {/* Полное описание */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Подробное описание</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedModule.fullDescription}</p>
                </div>

                {/* Особенности */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Особенности модуля</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedModule.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center bg-blue-50 rounded-lg p-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Детали */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-gray-900">{selectedModule.duration}</div>
                    <div className="text-sm text-gray-600">Длительность</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-bold text-gray-900">{selectedModule.progress}%</div>
                    <div className="text-sm text-gray-600">Прогресс</div>
                  </div>
                </div>

                {/* Прогресс бар */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Прогресс прохождения</span>
                    <span>{selectedModule.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedModule.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Кнопка закрытия в модальном окне */}
                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition"
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
