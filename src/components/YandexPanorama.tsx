// src/components/YandexPanorama.tsx
import React, { useEffect, useRef } from 'react';

interface YandexPanoramaProps {
  coordinates: [number, number]; // [долгота, широта]
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export const YandexPanorama: React.FC<YandexPanoramaProps> = ({ coordinates }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=panorama.locate,panorama.Player';
      script.async = true;
      script.onload = initPanorama;
      document.head.appendChild(script);
    } else {
      initPanorama();
    }

    function initPanorama() {
      if (!window.ymaps || !containerRef.current) return;

      if (!window.ymaps.panorama.isSupported()) {
        console.log('Панорамы не поддерживаются в этом браузере');
        return;
      }

      window.ymaps.panorama.locate(coordinates)
        .then((panoramas: any[]) => {
          if (!containerRef.current) return;
          if (panoramas.length) {
            new window.ymaps.panorama.Player(containerRef.current, panoramas[0], {
              direction: [0, 0],
            });
          } else {
            containerRef.current.innerHTML = '<p class="text-gray-400">Панорама не найдена для этого места</p>';
          }
        })
        .catch((err: any) => {
          console.error('Ошибка загрузки панорамы:', err);
        });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [coordinates]);

  return <div ref={containerRef} className="w-full h-[500px] rounded-lg overflow-hidden" />;
};