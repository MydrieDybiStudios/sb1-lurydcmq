import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Award, Star, Users, BarChart3, GraduationCap } from "lucide-react";

// Импортируем фото для VR модулей
import znakomstvo from "../logos/znakomstvo.jpg";
import avaria from "../logos/avaria.jpg";
import museum from "../logos/vr-museum.jpg";

const VRModule: React.FC = () => {
  const navigate = useNavigate();

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
      type: "exploration"
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
      type: "simulation"
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
      type: "simulation"
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
      type: "interactive"
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
      type: "educational"
    }
  ];

  // Статистика пользователя
  const userStats = [
    { label: "Общее время", value: "0 минут", icon: Clock, color: "text-blue-600" },
    { label: "Средний балл", value: "0%", icon: Award, color: "text-green-600" },
    { label: "Пройдено модулей", value: "0 из 5", icon: BarChart3, color: "text-purple-600" },
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

  const handleStartModule = (module: any) => {
    alert(`Запуск VR-модуля: ${module.title}\n\nПодключите VR-шлем для начала immersive-обучения`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">VR-модуль</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            5 самостоятельных модулей виртуальной реальности для immersive-обучения
          </p>
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

        {/* VR Модули */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">VR Модули</h2>
            <p className="text-gray-600">
              Выберите модуль для immersive-обучения в виртуальной реальности. Все модули доступны для прохождения.
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
                        onClick={() => handleStartModule(module)}
                        className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Начать
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
            <p className="text-blue-100">Испытайте профессию нефтяника на себе в виртуальной реальности</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-lg">Поддерживаемое оборудование:</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Oculus Quest 2/3/Pro</li>
                <li>• HTC Vive Series</li>
                <li>• Valve Index</li>
                <li>• PlayStation VR2</li>
                <li>• Windows Mixed Reality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-lg">Рекомендации:</h4>
              <ul className="space-y-2 text-blue-100">
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
