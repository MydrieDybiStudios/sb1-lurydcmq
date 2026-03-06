import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logos/logo.png';

const universities = [
  {
    name: 'Тюменский индустриальный университет',
    city: 'Тюмень',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 180 },
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 170 },
    ]
  },
  {
    name: 'Уфимский государственный нефтяной технический университет',
    city: 'Уфа',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 175 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 165 },
      { name: 'Энергетика', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
    ]
  },
  {
    name: 'Казанский федеральный университет',
    city: 'Казань',
    specialties: [
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 150 },
      { name: 'Химия', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 155 },
    ]
  },
  {
    name: 'Санкт-Петербургский горный университет',
    city: 'Санкт-Петербург',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 190 },
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 170 },
    ]
  },
  {
    name: 'РГУ нефти и газа (НИУ) имени И.М. Губкина',
    city: 'Москва',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 200 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 185 },
      { name: 'Энергетика', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 180 },
    ]
  },
  {
    name: 'Самарский государственный технический университет',
    city: 'Самара',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 150 },
    ]
  }
];

const UniversitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Югра.Нефть" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
            <h1 className="text-lg md:text-xl font-bold">Вузы и ЕГЭ</h1>
          </Link>
          <Link 
            to="/"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
          >
            На главную
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Куда поступать после школы?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Подберите вуз и специальность в нефтегазовой отрасли. Здесь представлены примерные проходные баллы ЕГЭ.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {universities.map((uni, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-2">{uni.name}</h3>
              <p className="text-gray-600 mb-4">{uni.city}</p>
              <h4 className="font-semibold mb-3">Специальности:</h4>
              {uni.specialties.map((spec, i) => (
                <div key={i} className="border-t border-gray-100 py-3 first:border-t-0">
                  <p className="font-medium">{spec.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {spec.subjects.map((sub, j) => (
                      <span key={j} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm mt-1">
                    Минимальный балл: <span className="font-bold text-yellow-600">{spec.minScore}</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            * Информация носит ознакомительный характер. Актуальные проходные баллы уточняйте на сайтах вузов.
          </p>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; 2025 Цифровая образовательная платформа "Югра.Нефть"</p>
      </footer>
    </div>
  );
};

export default UniversitiesPage;
