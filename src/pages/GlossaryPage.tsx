// src/pages/GlossaryPage.tsx
import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { glossaryData, glossaryCategories, GlossaryTerm } from '../data/glossaryData';

const GlossaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const filteredTerms = glossaryData.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Шапка */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
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
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск терминов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
          />
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

        {/* Сетка терминов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map(term => (
            <div
              key={term.id}
              onClick={() => setSelectedTerm(term)}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-yellow-500 transition-all transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-yellow-400">{term.term}</h3>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {glossaryCategories.find(c => c.id === term.category)?.icon}
                </span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-3">{term.definition}</p>
            </div>
          ))}
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
                  {selectedTerm.seeAlso.map(id => {
                    const relatedTerm = glossaryData.find(t => t.id === id);
                    return relatedTerm ? (
                      <button
                        key={id}
                        onClick={() => setSelectedTerm(relatedTerm)}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition"
                      >
                        {relatedTerm.term}
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