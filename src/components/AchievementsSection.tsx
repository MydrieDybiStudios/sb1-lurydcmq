import React, { useEffect, useState } from 'react';
import { Star, Mountain, HardHat, Crown, Medal } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import '../index.css'; // ✅ убедись, что Tailwind подключён

const achievementsList = [
  { id: 'course1', icon: Star, title: 'Новичок', desc: 'Завершение первого курса' },
  { id: 'course2', icon: Mountain, title: 'Геолог-исследователь', desc: 'Изучены основы геологии' },
  { id: 'course3', icon: HardHat, title: 'Инженер добычи', desc: 'Пройден курс по методам добычи' },
  { id: 'course4', icon: Crown, title: 'Мастер нефтегазовой отрасли', desc: '100% завершение курсов' },
  { id: 'course5', icon: Medal, title: 'Легенда нефтегаза', desc: '90%+ правильных ответов во всех тестах' },
];

const AchievementsSection: React.FC = () => {
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (!error && data) {
        setEarnedAchievements(data.map((a) => a.achievement_id));
      }
    };
    fetchAchievements();
  }, [userId]);

  return (
    <section id="achievements" className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Система достижений</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {achievementsList.map(({ id, icon: Icon, title, desc }) => {
            const isEarned = earnedAchievements.includes(id);
            return (
              <div
                key={id}
                className={`p-4 rounded-lg text-center transition transform hover:-translate-y-1 ${
                  isEarned
                    ? 'bg-yellow-100 border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-pulse-slow'
                    : 'bg-gray-100'
                }`}
              >
                <div
                  className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                    isEarned
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)] scale-110'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
