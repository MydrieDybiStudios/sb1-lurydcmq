// src/components/VideoModal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  // Все хуки вызываются безусловно в начале компонента
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Функция очистки
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

  // Если модальное окно закрыто, не рендерим содержимое
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl mx-4">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition z-10"
          title="Закрыть"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Контейнер для видео с соотношением сторон 16:9 */}
        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-yellow-500/30">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`${videoUrl}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoTitle}
          />
        </div>

        {/* Название видео */}
        <div className="mt-4 text-center text-white text-lg font-medium">
          {videoTitle}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;