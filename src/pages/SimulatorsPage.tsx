import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, Sparkles, Target, Award, ChevronRight, Info,
  Filter, GraduationCap, ArrowUpDown, Eye,
  ArrowLeft, Mountain, Waves, Flag, Drill as DrillIcon,
  Users, Code, Zap, Star, Heart, Rocket, Globe,
  MousePointer, ExternalLink, RefreshCw, HelpCircle, Lightbulb
} from 'lucide-react';

// ==================== КОМПОНЕНТ КАРТОЧКИ СИМУЛЯТОРА ====================
interface SimulatorCardProps {
  title: string;
  description: string;
  simpleExplanation: string;  // простое объяснение без пометки "для школьников"
  icon: string;
  iconBgColor: string;
  badgeText: string;
  badgeColor: string;
  time: string;
  difficulty: string;
  category: string;
  rating: number;
  onClick: () => void;
  isNew?: boolean;
}

const SimulatorCard: React.FC<SimulatorCardProps> = ({
  title,
  description,
  simpleExplanation,
  icon,
  iconBgColor,
  badgeText,
  badgeColor,
  time,
  difficulty,
  category,
  rating,
  onClick,
  isNew
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColor =
    difficulty === 'Начальный' ? 'bg-green-500/20 text-green-400' :
      difficulty === 'Средний' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400';

  return (
    <div
      className="group relative bg-gray-800/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-yellow-500/5 group-hover:to-yellow-500/10 transition-all duration-700 pointer-events-none`}></div>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className={`${iconBgColor} text-black w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className={`${badgeColor} px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
          {badgeText}
        </div>
        {isNew && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-10">
            NEW
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative group/image">
          <div className={`w-full h-full bg-gradient-to-br ${iconBgColor.replace('bg-', 'from-')}/20 to-${iconBgColor.replace('bg-', '')}/20 flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}>
            <span className="text-7xl filter drop-shadow-2xl transform group-hover/image:scale-110 group-hover/image:rotate-3 transition-all duration-500">{icon}</span>
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <span className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-lg transform hover:scale-105 transition">
              <Eye className="w-5 h-5" />
              Запустить
            </span>
          </div>
        </div>

        {/* Основное описание (короткое) */}
        <p className="text-gray-400 mb-2 line-clamp-2 leading-relaxed">{description}</p>

        {/* Простое объяснение (без пометки "для школьников") */}
        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 leading-relaxed">
            {simpleExplanation}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`${badgeColor} px-3 py-1 rounded-full text-xs`}>{badgeText}</span>
          <span className={`${difficultyColor} px-3 py-1 rounded-full text-xs`}>{difficulty}</span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {time}
          </span>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            {rating}
          </span>
        </div>

        {/* Информация о разработчике */}
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
          <Users className="w-4 h-4 text-yellow-500/70" />
          <span>Разработано <span className="text-yellow-500/90 font-medium">Командой Цифровой Образовательной Среды «Югра.Нефть»</span></span>
          <Heart className="w-3 h-3 text-red-400/50 ml-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// ==================== ГАЙД ПО ИСПОЛЬЗОВАНИЮ СИМУЛЯТОРОВ ====================
const GuideSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500/20 p-3 rounded-xl">
            <HelpCircle className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Как пользоваться симуляторами</h2>
        </div>

        <p className="text-gray-300 mb-8 text-lg">
          Все симуляторы работают прямо в браузере, бесплатно и без установки. Вы можете экспериментировать, менять параметры и наблюдать за результатами — это безопасно и наглядно!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MousePointer className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Выберите симулятор</h3>
            <p className="text-sm text-gray-400">Нажмите на карточку интересующего вас симулятора. Можно использовать фильтры и сортировку, чтобы быстрее найти нужный.</p>
          </div>

          <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Запустите</h3>
            <p className="text-sm text-gray-400">Нажмите на кнопку «Запустить» или на любую область карточки. Большинство симуляторов откроются в этой же вкладке, а некоторые — в новой (вы всегда сможете вернуться).</p>
          </div>

          <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Экспериментируйте</h3>
            <p className="text-sm text-gray-400">Изменяйте параметры, нажимайте на кнопки, наблюдайте за изменениями на графиках или 3D-моделях. Не бойтесь ошибаться — это учебные симуляторы.</p>
          </div>

          <div className="bg-gray-700/30 rounded-xl p-5 border border-gray-600">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">4. Вернитесь к выбору</h3>
            <p className="text-sm text-gray-400">Закончив работу, просто закройте вкладку или нажмите кнопку «Назад» в браузере, чтобы выбрать другой симулятор.</p>
          </div>
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-yellow-400">Важно:</span> Если симулятор не запускается, проверьте подключение к интернету, разрешите всплывающие окна (для тех, что открываются в новой вкладке) или обновите страницу. Все симуляторы оптимизированы для работы на компьютерах и планшетах.
          </p>
        </div>
      </div>
    </section>
  );
};

// ==================== СИМУЛЯТОРЫ (все наши) ====================
const GrpSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/grp-simulator.html';
  };

  return (
    <SimulatorCard
      title="ГРП Симулятор"
      description="Гидроразрыв пласта — моделирование трещины."
      simpleExplanation="Показывает, как создаются трещины в породе, чтобы нефть легче выходила. Можно менять давление и наблюдать за ростом трещины."
      icon="🏔️"
      iconBgColor="bg-yellow-500"
      badgeText="ГРП"
      badgeColor="bg-yellow-500/20 text-yellow-400"
      time="30 мин"
      difficulty="Средний"
      category="grp"
      rating={4.8}
      onClick={openSimulator}
      isNew={true}
    />
  );
};

const PetrelSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/petrel-lite.html';
  };

  return (
    <SimulatorCard
      title="Petrel Lite"
      description="Геологическое моделирование пластов."
      simpleExplanation="Строит 3D-модель подземных слоёв. Помогает увидеть, где находятся нефть, газ и вода."
      icon="🗻"
      iconBgColor="bg-purple-500"
      badgeText="Геология"
      badgeColor="bg-purple-500/20 text-purple-400"
      time="15 мин"
      difficulty="Начальный"
      category="geology"
      rating={4.6}
      onClick={openSimulator}
    />
  );
};

const EclipseSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/eclipse-lite.html';
  };

  return (
    <SimulatorCard
      title="Eclipse Lite"
      description="Гидродинамическое моделирование."
      simpleExplanation="Моделирует движение нефти и газа в пласте. Показывает, как меняется добыча со временем."
      icon="🌊"
      iconBgColor="bg-blue-500"
      badgeText="Гидродинамика"
      badgeColor="bg-blue-500/20 text-blue-400"
      time="20 мин"
      difficulty="Средний"
      category="hydrodynamic"
      rating={4.7}
      onClick={openSimulator}
    />
  );
};

const TNavigatorSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/tnavigator-lite.html';
  };

  return (
    <SimulatorCard
      title="tNavigator Lite"
      description="Отечественный симулятор месторождений."
      simpleExplanation="Быстрый симулятор, похожий на Eclipse. Показывает, как работают скважины и как изменяются потоки нефти."
      icon="🇷🇺"
      iconBgColor="bg-red-500"
      badgeText="Гидродинамика"
      badgeColor="bg-red-500/20 text-red-400"
      time="25 мин"
      difficulty="Средний"
      category="russian"
      rating={4.8}
      onClick={openSimulator}
    />
  );
};

const DrillingSimulator: React.FC = () => {
  const openSimulator = () => {
    window.location.href = '/simulators/drilling-lite.html';
  };

  return (
    <SimulatorCard
      title="Drilling Office Lite"
      description="Проектирование бурения."
      simpleExplanation="Позволяет спроектировать траекторию скважины. Можно выбрать угол бурения, чтобы точно попасть в нефтяной пласт."
      icon="🛢️"
      iconBgColor="bg-orange-500"
      badgeText="Бурение"
      badgeColor="bg-orange-500/20 text-orange-400"
      time="20 мин"
      difficulty="Средний"
      category="drilling"
      rating={4.5}
      onClick={openSimulator}
    />
  );
};

const FieldDirectorSimulator: React.FC = () => {
  const openSimulator = () => {
    window.open('https://mydriedybistudios.github.io/directorfield/', '_blank');
  };

  return (
    <SimulatorCard
      title="Директор месторождения"
      description="Стратегический симулятор управления."
      simpleExplanation="Игра, где нужно управлять нефтяной компанией: бурить скважины, продавать нефть, конкурировать с другими компаниями."
      icon="🏭"
      iconBgColor="bg-green-500"
      badgeText="Управление"
      badgeColor="bg-green-500/20 text-green-400"
      time="60 мин"
      difficulty="Средний"
      category="management"
      rating={4.9}
      onClick={openSimulator}
    />
  );
};

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
const SimulatorsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'difficulty' | 'time'>('popular');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Все симуляторы', icon: Filter },
    { id: 'ours', name: 'Разработанные нами', icon: Users },
    { id: 'grp', name: 'ГРП', icon: Target },
    { id: 'geology', name: 'Геология', icon: Mountain },
    { id: 'hydrodynamic', name: 'Гидродинамика', icon: Waves },
    { id: 'russian', name: 'Отечественные', icon: Flag },
    { id: 'drilling', name: 'Бурение', icon: DrillIcon },
    { id: 'management', name: 'Управление', icon: Cpu },
  ];

  const allSimulators = [
    { id: 'grp', category: 'grp', difficulty: 'Средний', time: 30, rating: 4.8 },
    { id: 'petrel', category: 'geology', difficulty: 'Начальный', time: 15, rating: 4.6 },
    { id: 'eclipse', category: 'hydrodynamic', difficulty: 'Средний', time: 20, rating: 4.7 },
    { id: 'tnavigator', category: 'russian', difficulty: 'Средний', time: 25, rating: 4.8 },
    { id: 'drilling', category: 'drilling', difficulty: 'Средний', time: 20, rating: 4.5 },
    { id: 'fielddirector', category: 'management', difficulty: 'Средний', time: 60, rating: 4.9 },
  ];

  const filteredSimulators = allSimulators
    .filter(sim => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'ours') return true; // показываем все
      return sim.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Начальный': 1, 'Средний': 2, 'Сложный': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
      return a.time - b.time;
    });

  const renderSimulator = (id: string) => {
    switch (id) {
      case 'grp': return <GrpSimulator />;
      case 'petrel': return <PetrelSimulator />;
      case 'eclipse': return <EclipseSimulator />;
      case 'tnavigator': return <TNavigatorSimulator />;
      case 'drilling': return <DrillingSimulator />;
      case 'fielddirector': return <FieldDirectorSimulator />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
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
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-500/20 p-4 rounded-2xl">
                <Cpu className="w-12 h-12 text-yellow-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-yellow-400 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
                  Симуляторы
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">
              Профессиональные обучающие симуляторы для нефтегазовой отрасли.
            </p>
            <p className="text-lg text-yellow-400/90 mb-8 flex items-center gap-2 bg-yellow-500/10 backdrop-blur-sm px-6 py-3 rounded-2xl w-fit border border-yellow-500/20">
              <Users className="w-6 h-6" />
              <span>Все симуляторы разработаны <span className="font-bold">Командой Цифровой Образовательной Среды «Югра.Нефть»</span></span>
            </p>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500 transition">
                <div className="text-3xl font-bold text-yellow-400">6</div>
                <div className="text-sm text-gray-400">Симуляторов</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500 transition">
                <div className="text-3xl font-bold text-yellow-400">4.8</div>
                <div className="text-sm text-gray-400">Средний рейтинг</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500 transition">
                <div className="text-3xl font-bold text-yellow-400">6</div>
                <div className="text-sm text-gray-400">Разработано нами</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ГАЙД ПО ИСПОЛЬЗОВАНИЮ */}
      <GuideSection />

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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${selectedCategory === cat.id
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Сортировка */}
            <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-1">
              <ArrowUpDown className="w-4 h-4 text-gray-400 ml-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-white px-3 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
            <div key={sim.id} className="animate-fadeIn">
              {renderSimulator(sim.id)}
            </div>
          ))}
        </div>
      </div>

      {/* CTA секция */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="relative">
            <Rocket className="w-16 h-16 text-black mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
              Выберите симулятор и погрузитесь в мир нефтегазовых технологий вместе с командой «Югра.Нефть»
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-xl transition transform hover:-translate-y-1 hover:shadow-2xl text-lg flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
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
