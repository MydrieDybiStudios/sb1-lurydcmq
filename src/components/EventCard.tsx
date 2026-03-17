import React from 'react';
import { Calendar, Clock, Users, MapPin, ExternalLink } from 'lucide-react';
import { Event } from '../types/event';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onCancel,
  isRegistered
}) => {
  const navigate = useNavigate();
  const now = new Date();
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const isUpcoming = start > now;
  const isPast = end < now;
  const isOngoing = start <= now && end >= now;

  const getStatusBadge = () => {
    if (event.status === 'cancelled') return 'bg-red-500/20 text-red-400';
    if (isOngoing) return 'bg-green-500/20 text-green-400';
    if (isPast) return 'bg-gray-500/20 text-gray-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  const getStatusText = () => {
    if (event.status === 'cancelled') return 'Отменено';
    if (isOngoing) return 'Идёт сейчас';
    if (isPast) return 'Завершено';
    return 'Предстоит';
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500 transition group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge()}`}>
            {getStatusText()}
          </span>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {event.event_type === 'lecture' ? 'Лекция' :
             event.event_type === 'webinar' ? 'Вебинар' :
             event.event_type === 'meeting' ? 'Встреча' :
             event.event_type === 'excursion' ? 'Экскурсия' : 'Мастер-класс'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-yellow-400 mb-2 line-clamp-2">{event.title}</h3>

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {start.toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} –{' '}
            {end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {event.speaker_name && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {event.speaker_name}{event.speaker_position && `, ${event.speaker_position}`}
            </div>
          )}
          {event.format === 'online' && event.platform && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Онлайн, {event.platform}
            </div>
          )}
        </div>

        <p className="text-gray-400 line-clamp-2 mb-4">{event.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {event.current_participants} / {event.max_participants} участников
          </div>
          {isUpcoming && !isPast && (
            isRegistered ? (
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">✓ Вы записаны</span>
                {onCancel && (
                  <button
                    onClick={() => onCancel(event.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Отменить
                  </button>
                )}
              </div>
            ) : (
              onRegister && (
                <button
                  onClick={() => onRegister(event.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition"
                  disabled={event.current_participants >= event.max_participants}
                >
                  {event.current_participants >= event.max_participants ? 'Мест нет' : 'Записаться'}
                </button>
              )
            )
          )}
          {isPast && event.recording_url && (
            <a
              href={event.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
            >
              Запись <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {/* Кнопка «Подробнее» всегда доступна */}
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="text-xs text-gray-400 hover:text-yellow-400"
          >
            Подробнее →
          </button>
        </div>
      </div>
    </div>
  );
};