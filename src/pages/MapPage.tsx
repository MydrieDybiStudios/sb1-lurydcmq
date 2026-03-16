// src/pages/MapPage.tsx
import React from 'react';
import FieldMap from '../components/FieldMap';
import { oilFieldsData } from '../types/field'; // Правильный импорт
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapPage: React.FC = () => {
  const navigate = useNavigate();

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

        <h1 className="text-4xl font-bold mb-2">
          <span className="text-yellow-400">3D-карта</span> месторождений ХМАО
        </h1>
        <p className="text-gray-400 mb-8">
          Кликните на месторождение, чтобы узнать подробности и перейти к симулятору добычи
        </p>
      </div>

      {/* Карта */}
      <div className="container mx-auto px-4 pb-12">
        <FieldMap fields={oilFieldsData} />
      </div>

      {/* Дополнительная информация */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Самотлорское</h3>
            <p className="text-gray-300 text-sm">
              Легендарное месторождение, открытое в 1965 году. За 60 лет добыто более 2,8 млрд тонн нефти.
              Сегодня здесь применяются технологии "Интеллектуального месторождения".
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Приобское</h3>
            <p className="text-gray-300 text-sm">
              Гигантское месторождение с запасами 5 млрд тонн. Разделено рекой Обь на две части,
              разрабатывается "Роснефтью" и "Газпром нефтью".
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Цифровые технологии</h3>
            <p className="text-gray-300 text-sm">
              На месторождениях ХМАО активно внедряются цифровые двойники, нейросети для оптимизации добычи
              и 3D-моделирование геологических объектов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;