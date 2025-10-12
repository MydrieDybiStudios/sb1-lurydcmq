import React, { useEffect, useState } from "react";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import "../index.css";

const achievementsList = [
  { id: 1, icon: Star, title: "Новичок", desc: "Завершение первого курса" },
  { id: 2, icon: Mountain, title: "Геолог-исследователь", desc: "Изучены основы геологии" },
  { id: 3, icon: HardHat, title: "Инженер добычи", desc: "Пройден курс по методам добычи" },
  { id: 4, icon: Crown, title: "Мастер нефтегазовой отрасли", desc: "100% завершение курсов" },
  { id: 5, icon: Medal, title: "Легенда нефтегаза", desc: "90%+ правильных ответов во всех тестах" },
];

const AchievementsSection: React.FC = () => {
  const [earnedAchievements, setEarnedAchievements] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🟡 Загружаем пользователя
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Ошибка получения пользователя:", error.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setLoading(false);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setEarnedAchievements([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 🟢 Загружаем достижения пользователя
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Ошибка загрузки достижений:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        // Преобразуем achievement_id в числа
        setEarnedAchievements(data.map((a) => Number(a.achievement_id)));
      }

      setLoading(false);
    };

    fetchAchievements();
  }, [userId]);

  return (
    <section id="achievements" className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">🏆 Система достижений</h2>

        {loading ? (
          <p className="text-center text-gray-500">Загрузка достижений...</p>
        ) : !userId ? (
          <p className="text-center text-gray-500">
            🔐 Войдите в аккаунт, чтобы увидеть свои достижения.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {achievementsList.map(({ id, icon: Icon, title, desc }) => {
              const isEarned = earnedAchievements.includes(id);
              return (
                <div
                  key={id}
                  className={`p-4 rounded-lg text-center transition transform hover:-translate-y-1 ${
                    isEarned
                      ? "bg-yellow-100 border-2 border-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-glow"
                      : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      isEarned
                        ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.8)] scale-110"
                        : "bg-gray-300 text-gray-600"
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
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
