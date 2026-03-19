import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { glossaryData, glossaryCategories } from '../data/glossaryData';

// Функция для получения первой буквы термина (с учётом русского и английского)
const getFirstLetter = (term: string): string => {
  const firstChar = term.charAt(0).toUpperCase();
  // Проверяем, русская ли буква (диапазон А-Я)
  const rusRegex = /^[А-ЯЁ]$/i;
  if (rusRegex.test(firstChar)) return firstChar;
  // Английская буква
  const engRegex = /^[A-Z]$/i;
  if (engRegex.test(firstChar)) return firstChar;
  // Цифры и остальное
  if (/^[0-9]$/.test(firstChar)) return '0-9';
  return '#';
};

// Список букв для навигации (А-Я + A-Z + 0-9 + #)
const alphabet = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М',
  'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0-9', '#'
];

const GlossaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<any | null>(null);

  // Фильтрация терминов по букве, категории и поиску
  const filteredTerms = useMemo(() => {
    return glossaryData.filter(term => {
      // По категории
      if (selectedCategory !== 'all' && term.category !== selectedCategory) return false;

      // По поиску
      if (searchTerm && !term.term.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !term.definition.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // По первой букве
      if (selectedLetter) {
        const firstLetter = getFirstLetter(term.term);
        if (firstLetter !== selectedLetter) return false;
      }
      return true;
    });
  }, [selectedCategory, searchTerm, selectedLetter]);

  // Группировка терминов по первой букве
  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: typeof glossaryData } = {};
    filteredTerms.forEach(term => {
      const letter = getFirstLetter(term.term);
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    // Сортируем буквы в порядке алфавита (сначала русские, потом английские, потом остальные)
    const order = alphabet;
    return Object.keys(groups)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as { [key: string]: typeof glossaryData });
  }, [filteredTerms]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Кнопка назад (опционально) */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          ← Назад
        </button>

        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-yellow-400">Словарь</span> терминов
          </h1>
        </div>
        <p className="text-xl text-gray-300 mb-8">
          Более {glossaryData.length} терминов из мира нефтегазовой отрасли
        </p>

        {/* Поиск */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск терминов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Алфавитная навигация */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-3 py-2 rounded-lg transition ${
                selectedLetter === null
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Все
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-2 rounded-lg transition ${
                  selectedLetter === letter
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Все
          </button>
          {glossaryCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Список терминов сгруппированный по буквам */}
        <div className="space-y-8">
          {Object.entries(groupedTerms).map(([letter, terms]) => (
            <div key={letter}>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 border-b border-yellow-500/30 pb-2">
                {letter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terms.map(term => (
                  <div
                    key={term.id}
                    onClick={() => setSelectedTerm(term)}
                    className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-yellow-400">{term.term}</h3>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {glossaryCategories.find(c => c.id === term.category)?.icon}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedTerms).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Термины не найдены</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLetter(null);
                }}
                className="mt-4 text-yellow-400 hover:text-yellow-300 underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно с подробным определением */}
      {selectedTerm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">{selectedTerm.term}</h2>
            <p className="text-gray-300 text-lg mb-6">{selectedTerm.definition}</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-400">Категория:</span>
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {glossaryCategories.find(c => c.id === selectedTerm.category)?.icon}{' '}
                {glossaryCategories.find(c => c.id === selectedTerm.category)?.name}
              </span>
            </div>
            {selectedTerm.seeAlso && selectedTerm.seeAlso.length > 0 && (
              <div className="mb-6">
                <span className="text-sm text-gray-400">См. также:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTerm.seeAlso.map((id: string) => {
                    const related = glossaryData.find(t => t.id === id);
                    return related ? (
                      <button
                        key={id}
                        onClick={() => setSelectedTerm(related)}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition"
                      >
                        {related.term}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <button
              onClick={() => setSelectedTerm(null)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryPage;