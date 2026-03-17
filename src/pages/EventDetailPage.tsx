import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Event } from '../types/event';
import { Calendar, Clock, Users, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEvent();
    fetchUser();
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;
    const { data } = await supabase.from('events').select('*').eq('id', id).single();
    setEvent(data);
    setLoading(false);
  };

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user && id) {
      const { data: reg } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', data.user.id)
        .maybeSingle();
      setIsRegistered(!!reg);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/?login');
      return;
    }
    try {
      const { error } = await supabase.rpc('register_for_event', {
        p_event_id: id,
        p_user_id: user.id
      });
      if (error) throw error;
      setIsRegistered(true);
      fetchEvent(); // обновить счётчик участников
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    const { error } = await supabase.rpc('cancel_registration', {
      p_event_id: id,
      p_user_id: user.id
    });
    if (error) {
      alert(error.message);
    } else {
      setIsRegistered(false);
      fetchEvent();
    }
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!event) return <div className="text-center py-12">Мероприятие не найдено</div>;

  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const isUpcoming = start > new Date();
  const isPast = end < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">{event.title}</h1>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-300">{event.description}</p>

              {event.speaker_name && (
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Спикер</h3>
                  <p className="text-white">{event.speaker_name}</p>
                  <p className="text-gray-400">{event.speaker_position}, {event.speaker_company}</p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Детали</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span>{start.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>{start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span>Участников: {event.current_participants} / {event.max_participants}</span>
                  </div>
                  {event.format === 'online' && event.platform && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>Онлайн, {event.platform}</span>
                    </div>
                  )}
                </div>
              </div>

              {isUpcoming && !isPast && (
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  {isRegistered ? (
                    <div className="text-center">
                      <p className="text-green-400 mb-2">Вы зарегистрированы</p>
                      <button
                        onClick={handleCancel}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 px-4 rounded-lg transition"
                      >
                        Отменить запись
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={event.current_participants >= event.max_participants}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {event.current_participants >= event.max_participants ? 'Мест нет' : 'Записаться'}
                    </button>
                  )}
                </div>
              )}

              {isPast && event.recording_url && (
                <a
                  href={event.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700/30 hover:bg-gray-700/50 p-4 rounded-lg text-center"
                >
                  <span className="text-yellow-400 font-medium">Смотреть запись</span>
                  <ExternalLink className="inline w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};