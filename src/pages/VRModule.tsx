import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Award, Star, Users, BarChart3, Map, BookOpen, GraduationCap } from "lucide-react";

// Импортируем фото для VR модулей


const VRModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<"excursions" | "modules">("excursions");
  const [completedExcursions, setCompletedExcursions] = useState<string[]>([]);
  const [showExcursionWarning, setShowExcursionWarning] = useState(false);

  // Экскурсии (обязательные для прохождения)
  const excursions = [
    {
      id: "excursion-1",
      title: "Знакомство с нефтяной промышленностью",
      description: "Обзорная экскурсия по основам нефтедобычи и оборудованию. Изучите базовые понятия и процессы.",
      duration: "10-15 минут",
      image: znakomstvo,
      required: true,
      modules: ["Понск месторождения", "Запуск буровой вышки"]
    },
    {
      id: "excursion-2",
      title: "Аварийные ситуации и безопасность",
      description: "Экскурсия по технике безопасности и действиям в аварийных ситуациях на месторождении.",
      duration: "15-20 минут",
      image: avaria,
      required: true,
      modules: ["Запуск насоса-качалки", "Лаборатория"]
    },
    {
      id: "excursion-3",
      title: "VR музей нефти",
      description: "Историческая экскурсия по развитию нефтяной промышленности в Югре.",
      duration: "20-25 минут",
      image: museum,
      required: false,
      modules: ["VR музей нефти"]
    }
  ];

  // Все VR модули как самостоятельные элементы
  const vrModules = [
    {
      id: 1,
      title: "Понск месторождения",
      description: "Виртуальное путешествие по процессу поиска и разведки нефтяных месторождений. Изучите современные методы геологоразведки в immersive-среде.",
      duration: "15-20 минут",
      difficulty: "Начальный",
      progress: 0,
      image: znakomstvo,
      features: ["3D модели оборудования", "Интерактивные сценарии", "Виртуальный гид"],
      type: "exploration",
      requiredExcursion: "excursion-1",
      locked: true
    },
    {
      id: 2,
      title: "Запуск буровой вышки",
      description: "Иммерсивный опыт строительства и запуска буровой установки. Управляйте процессом бурения в виртуальной реальности.",
      duration: "20-25 минут",
      difficulty: "Средний",
      progress: 0,
      image: znakomstvo,
      features: ["Симуляция управления", "Анимация процессов", "Техника безопасности"],
      type: "simulation",
      requiredExcursion: "excursion-1",
      locked: true
    },
    {
      id: 3,
      title: "Запуск насоса-качалки",
      description: "Виртуальная симуляция работы нефтедобывающего оборудования. Освойте принципы работы насосных станций.",
      duration: "25-30 минут",
      difficulty: "Средний",
      progress: 0,
      image: avaria,
      features: ["Реалистичная физика", "Аварийные ситуации", "Процедуры устранения"],
      type: "simulation",
      requiredExcursion: "excursion-2",
      locked: true
    },
    {
      id: 4,
      title: "Лаборатория",
      description: "Интерактивная лаборатория для исследования и анализа нефти. Проводите химические опыты в безопасной VR-среде.",
      duration: "30-35 минут",
      difficulty: "Продвинутый",
      progress: 0,
      image: avaria,
      features: ["Виртуальные эксперименты", "Анализ проб", "Исследовательские задачи"],
      type: "interactive",
      requiredExcursion: "excursion-2",
      locked: true
    },
    {
      id: 5,
      title: "VR музей нефти",
      description: "Виртуальный музей с историей нефтяной промышленности Югры. Исследуйте интерактивные экспонаты и архивные материалы.",
      duration: "40-50 минут",
      difficulty: "Начальный",
      progress: 0,
      image: museum,
      features: ["Исторические реконструкции", "Интерактивные экспонаты", "3D хронология"],
      type: "educational",
      requiredExcursion: "excursion-3",
      locked: false
    }
  ];

  // Статистика пользователя
  const userStats = [
    { label: "Общее время", value: "0 минут", icon: Clock, color: "text-blue-600" },
    { label: "Средний балл", value: "0%", icon: Award, color: "text-green-600" },
    { label: "Пройдено модулей", value: "0 из 5", icon: BarChart3, color: "text-purple-600" },
    { label: "Достижения", value: "0 из 15", icon: Star, color: "text-yellow-600" },
    { label: "Экскурсии", value: "0 из 3", icon: BookOpen, color: "text-orange-600" },
    { label: "Прогресс", value: "0%", icon: GraduationCap, color: "text-red-600" }
  ];

  // Проверяем доступность модулей на основе пройденных экскурсий
  useEffect(() => {
    const updatedModules = vrModules.map(module => ({
      ...module,
      locked: module.requiredExcursion ? !completedExcursions.includes(module.requiredExcursion) : false
    }));
    
    // Обновляем статистику
    const completedModulesCount = updatedModules.filter(m => m.progress > 0).length;
    const completedExcursionsCount = completedExcursions.length;
    
    userStats[0].value = "0 минут";
    userStats[1].value = "0%";
    userStats[2].value = `${completedModulesCount} из 5`;
    userStats[3].value = "0 из 15";
    userStats[4].value = `${completedExcursionsCount} из 3`;
    userStats[5].value = `${Math.round((completedModulesCount / 5) * 100)}%`;
    
  }, [completedExcursions]);

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

  const handleStartExcursion = (excursionId: string) => {
    alert(`Запуск экскурсии: ${excursions.find(e => e.id === excursionId)?.title}\n\nПодключите VR-шлем для начала экскурсии`);
    
    // После завершения экскурсии разблокируем модули
    setTimeout(() => {
      setCompletedExcursions(prev => [...prev, excursionId]);
      alert("Экскурсия завершена! Теперь доступны связанные модули.");
    }, 2000);
  };

  const handleStartModule = (module: any) => {
    if (module.locked) {
      setShowExcursionWarning(true);
      return;
    }
    
    alert(`Запуск VR-модуля: ${module.title}\n\nПодключите VR-шлем для начала immersive-обучения`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">VR-модуль</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Пройдите обязательные экскурсии для доступа к VR-модулям
          </p>
        </div>

        {/* Меню навигации */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveMenu("excursions")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeMenu === "excursions"
                  ? "bg-yellow-500 text-black shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Map className="w-5 h-5 inline mr-2" />
              Экскурсии
            </button>
            <button
              onClick={() => setActiveMenu("modules")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeMenu === "modules"
                  ? "bg-yellow-500 text-black shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              VR Модули
            </button>
          </div>
        </div>

        {/* Основная статистика */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {userStats.map((stat, index) => {
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

        {/* Содержимое в зависимости от активного меню */}
        {activeMenu === "excursions" ? (
          /* Экскурсии */
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">🚨 Внимание!</h2>
              <p className="text-yellow-700">
                Для доступа к VR-модулям необходимо пройти обязательные экскурсии. 
                Сначала завершите экскурсии "Знакомство с нефтяной промышленностью" и "Аварийные ситуации и безопасность".
              </p>
            </div>

            {excursions.map((excursion) => (
              <div key={excursion.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-yellow-300 transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  {/* Изображение экскурсии */}
                  <div className="lg:w-1/3">
                    <div className="aspect-video lg:aspect-square lg:h-full relative overflow-hidden">
                      <img
                        src={excursion.image}
                        alt={excursion.title}
                        className="w-full h-full object-cover"
                      />
                      {excursion.required && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Обязательная
                        </div>
                      )}
                      {completedExcursions.includes(excursion.id) && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ✔ Пройдена
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Информация об экскурсии */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{excursion.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{excursion.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Открывает доступ к модулям:</h4>
                          <div className="flex flex-wrap gap-2">
                            {excursion.modules.map((module, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                {module}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">⏱️ {excursion.duration}</span>
                          {excursion.required && (
                            <span className="text-red-500 text-sm font-semibold">
                              Обязательна для прохождения
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Кнопка запуска */}
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleStartExcursion(excursion.id)}
                          disabled={completedExcursions.includes(excursion.id)}
                          className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                            completedExcursions.includes(excursion.id)
                              ? "bg-green-500 text-white cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600 text-black transform hover:scale-105"
                          }`}
                        >
                          {completedExcursions.includes(excursion.id) ? (
                            "✅ Экскурсия пройдена"
                          ) : (
                            <>
                              <Play className="w-5 h-5 inline mr-2" />
                              Начать экскурсию
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VR Модули */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">VR Модули</h2>
              <p className="text-gray-600">
                {completedExcursions.length < 2 
                  ? "Пройдите обязательные экскурсии для разблокировки модулей"
                  : "Выберите модуль для immersive-обучения в виртуальной реальности"
                }
              </p>
            </div>

            {vrModules.map((module) => (
              <div key={module.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
                module.locked 
                  ? "border-red-200 bg-red-50 opacity-75" 
                  : "border-gray-100 hover:border-yellow-300"
              }`}>
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
                      {module.locked && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">🔒</div>
                            <div className="text-red-600 font-semibold">Заблокировано</div>
                          </div>
                        </div>
                      )}
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

                        {/* Состояние доступа */}
                        {module.locked && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-700 text-sm">
                              🔒 Для доступа к этому модулю необходимо пройти экскурсию:{" "}
                              <strong>
                                {excursions.find(e => e.id === module.requiredExcursion)?.title}
                              </strong>
                            </p>
                          </div>
                        )}
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
                          onClick={() => handleStartModule(module)}
                          disabled={module.locked}
                          className={`ml-4 py-3 px-6 rounded-xl font-bold transition-all ${
                            module.locked
                              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600 text-black transform hover:scale-105"
                          }`}
                        >
                          <Play className="w-5 h-5 mr-2 inline" />
                          {module.locked ? "Заблокировано" : "Начать"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Предупреждение о необходимости экскурсии */}
        {showExcursionWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Модуль недоступен</h3>
                <p className="text-gray-600">
                  Для доступа к этому модулю необходимо посетить наши экскурсии.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExcursionWarning(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
                  Понятно
                </button>
                <button
                  onClick={() => {
                    setShowExcursionWarning(false);
                    setActiveMenu("excursions");
                  }}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition"
                >
                  Узнать о местах проведения экскурсий
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Информация о VR-оборудовании */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mt-12 text-white">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Готовы к погружению в VR?</h3>
            <p className="text-blue-100">Чтобы испытать профессию нефтяника на себе, посетите наши экскурсии</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-lg">Этапы обучения:</h4>
              <ol className="space-y-2 text-blue-100 list-decimal list-inside">
                <li>Посетите наши экскурсии</li>
                <li>Изучите теорию и безопасность</li>
                <li>Приступайте к практическим модулям</li>
                <li>Закрепите знания в VR-среде</li>
              </ol>
            </div>
           

        {/* Кнопка возврата */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/cabinet")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
          >
            Вернуться в кабинет
          </button>
        </div>
      </div>
    </div>
  );
};

export default VRModule;
