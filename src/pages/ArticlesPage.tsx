// src/pages/ArticlesPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Search, X} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { articlesData, articleCategories } from '../data/articlesData';

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articlesData.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-yellow-400">Технические</span> статьи
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Глубокое погружение в технологии нефтегазовой отрасли
        </p>

        {/* Поиск */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по статьям..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
          {articleCategories.map(cat => (
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

        {/* Сетка статей */}
        <div className="grid grid-cols-1 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500 transition cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap">
                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                    {articleCategories.find(c => c.id === article.category)?.icon} {articleCategories.find(c => c.id === article.category)?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-3">{article.title}</h3>
                <p className="text-gray-400 mb-4">{article.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Если ничего не найдено */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Статьи не найдены</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 text-yellow-400 hover:text-yellow-300 underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно со статьёй */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative max-w-4xl mx-auto my-8 bg-gray-800 rounded-2xl p-8 border border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-yellow-400 mb-4">{selectedArticle.title}</h2>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap">
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                {articleCategories.find(c => c.id === selectedArticle.category)?.icon} {articleCategories.find(c => c.id === selectedArticle.category)?.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedArticle.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {selectedArticle.author}
              </span>
              <span>{selectedArticle.date}</span>
            </div>

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {selectedArticle.references && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Литература</h3>
                <ul className="list-disc pl-5 text-gray-300">
                  {selectedArticle.references.map((ref: string, idx: number) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;