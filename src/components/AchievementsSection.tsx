import React, { useEffect, useState } from "react";
import { 
  Star, 
  Mountain, 
  HardHat, 
  Crown, 
  Medal, 
  GraduationCap, 
  Search, 
  Drill, 
  Leaf, 
  Flask, 
  Compass 
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const iconsMap: Record<string, any> = {
  'star': Star,
  'mountain': Mountain,
  'hard-hat': HardHat,
  'crown': Crown,
  'medal': Medal,
  'graduation-cap': GraduationCap,
  'search': Search,
  'drill': Drill,
  'leaf': Leaf,
  'flask': Flask,
  'compass': Compass
};

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  course_key: string | null;
  name: string;
  created_at: string;
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
    return (
      <p className="text-center text-gray-500 py-16">
        Загрузка достижений...
      </p>
    );

  return (
    <section id="achievements" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">🏆 Мои достижения</h2>
        
        {!userId ? (
          <p className="text-center text-gray-500">
            🔐 Войдите в аккаунт, чтобы увидеть свои достижения.
          </p>
        ) : achievements.length === 0 ? (
          <p className="text-center text-gray-500">
            Пока нет достижений. Начните проходить курсы!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map(({ id, title, description, icon }) => {
              const earnedNow = earned.includes(id);
              const Icon = iconsMap[icon] || Crown;
              return (
                <div
                  key={id}
                  className={`p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                    earnedNow
                      ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-lg shadow-yellow-200"
                      : "bg-white border border-gray-200 opacity-70"
                  }`}
                >
                  <div
                    className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transition-all ${
                      earnedNow
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-400 scale-110"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                  <div className={`mt-3 text-xs font-medium ${earnedNow ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {earnedNow ? '✅ Получено' : '🔒 Не получено'}
                  </div>
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
