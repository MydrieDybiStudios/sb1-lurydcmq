import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Olympiad } from '../types/olympiad';

const OlympiadsPage: React.FC = () => {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('olympiads')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    setOlympiads(data || []);
    setLoading(false);
  };

  const getRegistrationStatus = (olympiad: Olympiad) => {
    const now = new Date();
    const start = olympiad.registration_start ? new Date(olympiad.registration_start) : null;
    const end = olympiad.registration_end ? new Date(olympiad.registration_end) : null;

    if (!start || !end) return { text: 'Даты не указаны', color: 'bg-gray-100 text-gray-600' };
    if (now < start) return { text: 'Регистрация ещё не началась', color: 'bg-yellow-100 text-yellow-800' };
    if (now > end) return { text: 'Регистрация завершена', color: 'bg-red-100 text-red-800' };
    return { text: 'Идёт регистрация', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-yellow-400">Олимпиады</span> и конкурсы
        </h1>
        <p className="text-gray-400 mb-8">
          Проверьте свои знания и получите дипломы!
        </p>

        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {olympiads.map(olympiad => {
              const regStatus = getRegistrationStatus(olympiad);
              return (
                <div
                  key={olympiad.id}
                  className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500 transition group"
                >
                  {olympiad.cover_image_url && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={olympiad.cover_image_url}
                        alt={olympiad.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2 line-clamp-2">
                      {olympiad.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {olympiad.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      {olympiad.registration_start && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          Начало регистрации: {new Date(olympiad.registration_start).toLocaleDateString()}
                        </div>
                      )}
                      {olympiad.registration_end && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          Окончание: {new Date(olympiad.registration_end).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${regStatus.color}`}>
                        {regStatus.text}
                      </span>
                      <Link
                        to={`/olympiads/${olympiad.id}`}
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            {olympiads.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Пока нет активных олимпиад. Загляните позже!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OlympiadsPage;
