import React, { useEffect, useState } from "react";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const iconsMap: Record<string, any> = {
  Star,
  Mountain,
  HardHat,
  Crown,
  Medal,
};

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  emoji?: string; // 🆕 добавляем поле emoji
}

interface Progress {
  id: number;
  user_id: string;
  course_id: string;
  points: number;
}

const AchievementsSection: React.FC = () => {
  const [earned, setEarned] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🆕 новые состояния
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [coursesMap, setCoursesMap] = useState<Record<string, string>>({});

  // Авторизация
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
      else setLoading(false);
    };
    getUser();
  }, []);

  // Загрузка достижений
  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data) setAchievements(data);
    };
    fetchAchievements();
  }, []);

  // Загрузка курсов (для отображения их имён вместо id)
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("id, title");
      if (!error && data) {
        const map: Record<string, string> = {};
        data.forEach((c) => {
          map[c.id] = c.title;
        });
        setCoursesMap(map);
      }
    };
    fetchCourses();
  }, []);

  // Загрузка полученных достижений
  useEffect(() => {
    const fetchEarned = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      if (!error && data) setEarned(data.map((a) => Number(a.achievement_id)));
      setLoading(false);
    };
    fetchEarned();
  }, [userId]);

  // 🆕 Загрузка прогресса и суммирование баллов
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("progress")
        .select("course_id, points")
        .eq("user_id", userId);

      if (!error && data) {
        const total = data.reduce((sum, row) => sum + (row.points || 0), 0);
        setTotalPoints(total);
      }
    };
    fetchProgress();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-16">Загрузка достижений...</p>
    );

  return (
    <section id="achievements" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          🏆 Система достижений
        </h2>

        {!userId ? (
          <p className="text-center text-gray-500">
            🔐 Войдите в аккаунт, чтобы увидеть свои достижения.
          </p>
        ) : (
          <>
            {/* 🆕 Отображаем общие баллы */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700">
                Ваши общие баллы:{" "}
                <span className="font-bold text-yellow-600">{totalPoints}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {achievements.map(({ id, title, description, icon, emoji }) => {
                const earnedNow = earned.includes(id);
                const Icon = iconsMap[icon] || Star;

                return (
                  <div
                    key={id}
                    className={`p-4 rounded-lg text-center transition transform hover:-translate-y-1 ${
                      earnedNow
                        ? "bg-yellow-100 border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {/* 🆕 эмодзи вместо иконки, если есть */}
                    <div
                      className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-3xl ${
                        earnedNow
                          ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)] scale-110"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {emoji ? emoji : <Icon className="w-8 h-8" />}
                    </div>

                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                );
              })}
            </div>

            {/* 🆕 Пример отображения курсов с именами */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                🎓 Пройденные курсы
              </h3>
              {Object.keys(coursesMap).length > 0 ? (
                <ul className="inline-block text-left">
                  {Object.entries(coursesMap).map(([id, title]) => (
                    <li key={id} className="text-gray-700">
                      • {title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Курсы пока не найдены</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
