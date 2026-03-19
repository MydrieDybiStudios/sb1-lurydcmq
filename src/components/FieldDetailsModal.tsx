// src/components/FieldDetailsModal.tsx
import React, { useEffect } from 'react';
import { X, Calendar, Factory, Gauge, CircleDot } from 'lucide-react';
import { OilField } from '../types/field';

interface FieldDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: OilField | null;
}

const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({ isOpen, onClose, field }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !field) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isMuseum = field.production.annual === 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-yellow-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors border border-yellow-500/30"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-yellow-400 mb-2">{field.name}</h2>
          <p className="text-gray-400 text-lg mb-8">{field.description}</p>

          {/* Основные характеристики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <Calendar className="w-5 h-5 text-yellow-400 mb-2" />
              <div className="text-sm text-gray-400">Год открытия</div>
              <div className="text-xl font-bold text-white">{field.yearDiscovered}</div>
            </div>

            {!isMuseum && (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <Factory className="w-5 h-5 text-yellow-400 mb-2" />
                  <div className="text-sm text-gray-400">Оператор</div>
                  <div className="text-sm font-bold text-white">{field.operator}</div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <Gauge className="w-5 h-5 text-yellow-400 mb-2" />
                  <div className="text-sm text-gray-400">Годовая добыча</div>
                  <div className="text-xl font-bold text-white">{field.production.annual} млн т</div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <CircleDot className="w-5 h-5 text-yellow-400 mb-2" />
                  <div className="text-sm text-gray-400">Извлекаемые запасы</div>
                  <div className="text-xl font-bold text-white">{field.reserves.recoverable} млн т</div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            {/* Полное описание */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">📋 Полное описание</h3>
              <p className="text-gray-300 leading-relaxed">{field.fullDescription}</p>
            </div>

            {/* История */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">
                {isMuseum ? '📜 История открытия' : '📜 История открытия и разработки'}
              </h3>
              <p className="text-gray-300 leading-relaxed">{field.history}</p>
            </div>

            {/* Геологическое строение (только для месторождений) */}
            {!isMuseum && (
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⛰️ Геологическое строение</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{field.geology}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Мин. глубина</div>
                    <div className="text-lg font-bold text-white">{field.depth.min} м</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Макс. глубина</div>
                    <div className="text-lg font-bold text-white">{field.depth.max} м</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Средняя глубина</div>
                    <div className="text-lg font-bold text-white">{field.depth.average} м</div>
                  </div>
                </div>
              </div>
            )}

            {/* Особенности разработки (только для месторождений) */}
            {!isMuseum && (
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⚙️ Особенности разработки</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{field.development}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Накопленная добыча</div>
                    <div className="text-lg font-bold text-white">{field.production.cumulative} млн т</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Пик добычи</div>
                    <div className="text-lg font-bold text-white">{field.production.peak.year} г. ({field.production.peak.value} млн т)</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Количество скважин</div>
                    <div className="text-lg font-bold text-white">{field.production.wells.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Запасы газа</div>
                    <div className="text-lg font-bold text-white">{field.reserves.gas} млрд м³</div>
                  </div>
                </div>
              </div>
            )}

            {/* Свойства нефти (только для месторождений) */}
            {!isMuseum && (
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🛢️ Свойства нефти</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Плотность</div>
                    <div className="text-lg font-bold text-white">{field.oilProperties.density} кг/м³</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Сера</div>
                    <div className="text-lg font-bold text-white">{field.oilProperties.sulfur}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Парафины</div>
                    <div className="text-lg font-bold text-white">{field.oilProperties.paraffin}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Вязкость</div>
                    <div className="text-lg font-bold text-white">{field.oilProperties.viscosity}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">API</div>
                    <div className="text-lg font-bold text-white">{field.oilProperties.api}°</div>
                  </div>
                </div>
              </div>
            )}

            {/* Инфраструктура */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">
                {isMuseum ? '🏗️ Инфраструктура музея' : '🏗️ Инфраструктура'}
              </h3>
              <p className="text-gray-300 leading-relaxed">{field.infrastructure}</p>
            </div>

            {/* Экология (только для месторождений) */}
            {!isMuseum && field.ecology && (
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🌿 Экология</h3>
                <p className="text-gray-300 leading-relaxed">{field.ecology}</p>
              </div>
            )}

            {/* Интересные факты */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">✨ Интересные факты</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {field.facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>

            {/* Виртуальный тур для музея */}
            {isMuseum && field.panoramaIframeUrl && (
              <div className="mt-6 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🎮 Виртуальный тур</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={field.panoramaIframeUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                    title="Виртуальный тур музея"
                  />
                </div>
              </div>
            )}

            {/* Кнопка симулятора */}
            {field.simulatorLink && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => window.open(field.simulatorLink, '_blank')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-xl transition transform hover:-translate-y-1 hover:shadow-xl text-lg"
                >
                  {isMuseum ? 'Виртуальный тур в музее' : 'Перейти к симулятору добычи'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;