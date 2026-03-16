// src/pages/BooksPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Download, BookOpen, FileText, Search, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { booksData, bookCategories } from '../data/booksData';

const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = booksData.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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

        {/* Заголовок */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-yellow-400">Книги</span> и методички
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Учебники, справочники и методические пособия для скачивания
        </p>

        {/* Поиск */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по книгам, авторам, тегам..."
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
          {bookCategories.map(cat => (
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

        {/* Сетка книг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500 transition group"
            >
              <div className="h-48 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center relative">
                <BookOpen className="w-20 h-20 text-yellow-500/50" />
                <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-400">
                  {bookCategories.find(c => c.id === book.category)?.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{book.author}</p>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{book.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>{book.year} г.</span>
                  <span>•</span>
                  <span>{book.pages} стр.</span>
                  <span>•</span>
                  <span>{book.size}</span>
                  <span>•</span>
                  <span className="uppercase">{book.format}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {book.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {book.source && (
                  <p className="text-xs text-gray-500 mb-4">Источник: {book.source}</p>
                )}

                <div className="flex gap-2">
                  <a
                    href={book.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </a>
                  <a
                    href={book.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition"
                    title="Открыть источник"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  * Для некоторых источников требуется бесплатная регистрация
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Если ничего не найдено */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Книги не найдены</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 text-yellow-400 hover:text-yellow-300 underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;