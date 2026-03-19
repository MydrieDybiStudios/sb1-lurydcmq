// src/components/FieldMap.tsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OilField } from '../types/field';
import { Droplet, MapPin, Info, Landmark } from 'lucide-react';
import FieldDetailsModal from './FieldDetailsModal';

// Исправление для иконок Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FieldMapProps {
  fields: OilField[];
  center?: [number, number];
  zoom?: number;
}

const FieldMap: React.FC<FieldMapProps> = ({ 
  fields, 
  center = [61.0, 69.0], 
  zoom = 7 
}) => {
  const [selectedField, setSelectedField] = useState<OilField | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Иконка для нефтяных месторождений (золотая капля)
  const oilIcon = L.divIcon({
    className: 'custom-marker oil-marker',
    html: `<div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black animate-pulse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Иконка для музея (синее здание)
const museumIcon = L.divIcon({
  className: 'custom-marker museum-marker',
  html: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white text-lg animate-pulse">
          🏛️
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

  const isMuseum = (field: OilField) => field.production.annual === 0;

  const handleOpenDetails = (field: OilField) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative h-[600px] w-full rounded-xl overflow-hidden border-2 border-yellow-500/30 shadow-2xl">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution=''
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Маркеры месторождений и музея */}
          {fields.map((field) => (
            <Marker
              key={field.id}
              position={field.coordinates}
              icon={isMuseum(field) ? museumIcon : oilIcon}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{field.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{field.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    {isMuseum(field) ? (
                      // Для музея показываем год открытия и краткую информацию
                      <div className="col-span-2">
                        <span className="text-gray-500">Год открытия:</span><br />
                        <strong>{field.yearDiscovered}</strong>
                      </div>
                    ) : (
                      // Для месторождений показываем стандартные параметры
                      <>
                        <div>
                          <span className="text-gray-500">Год:</span><br />
                          <strong>{field.yearDiscovered}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Добыча:</span><br />
                          <strong>{field.production.annual} млн т/год</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Запасы:</span><br />
                          <strong>{field.reserves.recoverable} млн т</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Глубина:</span><br />
                          <strong>{field.depth.min}-{field.depth.max} м</strong>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenDetails(field)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-2 px-3 rounded-lg text-sm transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Подробнее
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Легенда с разделением на месторождения и музеи */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-yellow-500/30 z-[1000] max-w-xs">
          {/* Заголовок для месторождений */}
          <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Крупнейшие месторождения ХМАО
          </h4>
          <ul className="space-y-1 text-sm mb-4">
            {fields
              .filter(f => !isMuseum(f))
              .map(field => (
                <li key={field.id} className="flex items-center gap-2">
                  <Droplet className="w-3 h-3 text-yellow-400" />
                  <span>{field.name}</span>
                  <span className="text-gray-400 text-xs">({field.production.annual} млн т/год)</span>
                </li>
              ))}
          </ul>

          {/* Заголовок для музеев */}
          <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            Музеи нефти
          </h4>
          <ul className="space-y-1 text-sm">
            {fields
              .filter(f => isMuseum(f))
              .map(field => (
                <li key={field.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>{field.name}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <FieldDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={selectedField}
      />
    </>
  );
};

export default FieldMap;