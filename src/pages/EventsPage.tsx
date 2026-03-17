import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { EventCard } from '../components/EventCard';
import { Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, [filter, search]);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) {
      fetchUserRegistrations(data.user.id);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase.from('events').select('*');

    const now = new Date().toISOString();
    if (filter === 'upcoming') {
      query = query.gt('start_time', now);
    } else if (filter === 'past') {
      query = query.lt('start_time', now);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data } = await query.order('start_time', { ascending: filter === 'upcoming' });
    setEvents(data || []);
    setLoading(false);
  };

  const fetchUserRegistrations = async (userId: string) => {
    const { data } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', userId);
    setRegisteredEvents(data?.map(r => r.event_id) || []);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      // Если не авторизован, перенаправляем на страницу входа (или показываем модалку)
      navigate('/?login');
      return;
    }

    try {
      const { error } = await supabase.rpc('register_for_event', {
        p_event_id: eventId,
        p_user_id: user.id
      });
      if (error) throw error;
      // Обновляем данные
      fetchEvents();
      fetchUserRegistrations(user.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!user) return;
    const { error } = await supabase.rpc('cancel_registration', {
      p_event_id: eventId,
      p_user_id: user.id
    });
    if (error) {
      alert(error.message);
    } else {
      fetchEvents();
      fetchUserRegistrations(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-yellow-400">Мероприятия</span> и встречи
        </h1>
        <p className="text-gray-400 mb-6">
          Лекции, вебинары и встречи с экспертами нефтегазовой отрасли
        </p>

        {/* Фильтры и поиск */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1">
            {['all', 'upcoming', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === f ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'upcoming' ? 'Предстоящие' : 'Прошедшие'}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск мероприятий..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Сетка мероприятий */}
        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Мероприятий не найдено</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                onCancel={handleCancel}
                isRegistered={registeredEvents.includes(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};