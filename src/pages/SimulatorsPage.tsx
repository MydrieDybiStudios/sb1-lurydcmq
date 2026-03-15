// src/pages/SimulatorsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Sparkles, Target, Award, ChevronRight, Info,
  Filter, GraduationCap, ArrowUpDown, Eye,
  ArrowLeft, Mountain, Waves, Flag, Drill as DrillIcon
} from 'lucide-react';

// Компонент симулятора ГРП
const GrpSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/grp-simulator.html';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={openSimulator}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🏔️
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">ГРП Симулятор</h3>
            <p className="text-sm text-gray-400">Гидроразрыв пласта</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
          Новый
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group">
          <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
            <span className="text-6xl">🏔️</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Запустить
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-2">
          Изучите процесс гидроразрыва пласта и влияние различных параметров на геометрию трещины.
        </p>
        <div className="flex gap-2">
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">Профессиональный</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Средний</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">30 мин</span>
        </div>
      </div>
    </div>
  );
};

// Компонент Petrel Lite
const PetrelSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/petrel-lite.html';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={openSimulator}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🗻
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Petrel Lite</h3>
            <p className="text-sm text-gray-400">Геологическое моделирование</p>
          </div>
        </div>
        <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
          Schlumberger
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
            <span className="text-6xl">🗻</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-purple-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Запустить
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-2">
          Создавайте модели пластов, изучайте пористость и распределение песчаников.
        </p>
        <div className="flex gap-2">
          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">Геология</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Начальный</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">15 мин</span>
        </div>
      </div>
    </div>
  );
};

// Компонент Eclipse Lite
const EclipseSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/eclipse-lite.html';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={openSimulator}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🌊
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Eclipse Lite</h3>
            <p className="text-sm text-gray-400">Гидродинамическое моделирование</p>
          </div>
        </div>
        <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
          Schlumberger
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
            <span className="text-6xl">🌊</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-blue-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Запустить
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-2">
          Моделируйте движение флюидов в пласте и оптимизируйте разработку месторождений.
        </p>
        <div className="flex gap-2">
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">Гидродинамика</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Средний</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">20 мин</span>
        </div>
      </div>
    </div>
  );
};

// Компонент tNavigator Lite
const TNavigatorSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/tnavigator-lite.html';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={openSimulator}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🇷🇺
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">tNavigator Lite</h3>
            <p className="text-sm text-gray-400">Отечественный симулятор</p>
          </div>
        </div>
        <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">
          Rock Flow Dynamics
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group">
          <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
            <span className="text-6xl">🇷🇺</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-red-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Запустить
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-2">
          Высокопроизводительный симулятор для моделирования разработки месторождений.
        </p>
        <div className="flex gap-2">
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">Отечественный</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Средний</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">25 мин</span>
        </div>
      </div>
    </div>
  );
};

// Компонент Drilling Office Lite
const DrillingSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/drilling-lite.html';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={openSimulator}>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-black w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🛢️
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Drilling Office Lite</h3>
            <p className="text-sm text-gray-400">Проектирование бурения</p>
          </div>
        </div>
        <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
          Schlumberger
        </div>
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group">
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
            <span className="text-6xl">🛢️</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="bg-orange-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Запустить
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-2">
          Оптимизируйте траекторию скважин и параметры бурения для достижения целевых горизонтов.
        </p>
        <div className="flex gap-2">
          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs">Бурение</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Средний</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">20 мин</span>
        </div>
      </div>
    </div>
  );
};

const SimulatorsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'difficulty' | 'time'>('popular');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Все симуляторы', icon: Filter },
    { id: 'grp', name: 'ГРП', icon: Target },
    { id: 'geology', name: 'Геология', icon: Mountain },
    { id: 'hydrodynamic', name: 'Гидродинамика', icon: Waves },
    { id: 'russian', name: 'Отечественные', icon: Flag },
    { id: 'drilling', name: 'Бурение', icon: DrillIcon },
  ];

  // Всего 5 симуляторов
  const allSimulators = [
    { id: 'grp', category: 'grp', difficulty: 'Средний', time: 30, rating: 4.8 },
    { id: 'petrel', category: 'geology', difficulty: 'Начальный', time: 15, rating: 4.6 },
    { id: 'eclipse', category: 'hydrodynamic', difficulty: 'Средний', time: 20, rating: 4.7 },
    { id: 'tnavigator', category: 'russian', difficulty: 'Средний', time: 25, rating: 4.8 },
    { id: 'drilling', category: 'drilling', difficulty: 'Средний', time: 20, rating: 4.5 },
  ];

  const filteredSimulators = allSimulators
    .filter(sim => selectedCategory === 'all' ? true : sim.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Начальный': 1, 'Средний': 2, 'Сложный': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
      return a.time - b.time;
    });

  // Функция для отображения нужного симулятора по id
  const renderSimulator = (id: string) => {
    switch(id) {
      case 'grp': return <GrpSimulator />;
      case 'petrel': return <PetrelSimulator />;
      case 'eclipse': return <EclipseSimulator />;
      case 'tnavigator': return <TNavigatorSimulator />;
      case 'drilling': return <DrillingSimulator />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Кнопка назад в личный кабинет */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/cabinet')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          В личный кабинет
        </button>
      </div>

      {/* Герой-секция */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-10 h-10 text-yellow-400" />
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-yellow-400">Симуляторы</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Профессиональные симуляторы для обучения и практики в нефтегазовой отрасли
            </p>
            
            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">5</div>
                <div className="text-sm text-gray-400">Симуляторов</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">4.7</div>
                <div className="text-sm text-gray-400">Средний рейтинг</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">4</div>
                <div className="text-sm text-gray-400">Schlumberger</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">1</div>
                <div className="text-sm text-gray-400">Отечественный</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Категории */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Сортировка */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
              >
                <option value="popular">По популярности</option>
                <option value="difficulty">По сложности</option>
                <option value="time">По времени</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Сетка симуляторов */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSimulators.map((sim) => (
            <div key={sim.id}>
              {renderSimulator(sim.id)}
            </div>
          ))}
        </div>
      </div>

      {/* CTA секция */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Хочешь попробовать?
            </h2>
            <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
              Выбери любой симулятор и начни обучение прямо сейчас
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setSelectedCategory('all')}
                className="bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-xl transition transform hover:-translate-y-1 hover:shadow-2xl text-lg"
              >
                Все симуляторы
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorsPage;