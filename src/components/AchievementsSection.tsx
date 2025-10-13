import React, { useEffect, useState } from "react";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const iconsMap: Record<string, any> = {
  star: Star,
  mountain: Mountain,
  "hard-hat": HardHat,
  crown: Crown,
  medal: Medal,
};

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  course_key: string | null;
}

const AchievementsSection: React.FC = () => {
  const [earned, setEarned] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Получаем пользователя
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
      setLoading(false);
    };
    getUser();
  }, []);

  // Загружаем список достижений
  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data) setAchievements(data);
    };
    fetchAchievements();
  }, []);

  // Загружаем уже полученные пользователем достижения
  useEffect(() => {
    const fetchEarned = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      if (!error && data) {
        setEarned(data.map((a) => a.achievement_id));
      }
    };
    fetchEarned();
  }, [userId]);

  if (loading)
    return <p className="text-center text-gray-500 py-16">Загрузка достижений...</p>;

  return (

        {!userId ? (
          <p className="text-center text-gray-500">
            🔐 Войдите в аккаунт, чтобы увидеть свои достижения.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {achievements.map(({ id, title, description, icon }) => {
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
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 ${
                      earnedNow
                        ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)] scale-110"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
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
