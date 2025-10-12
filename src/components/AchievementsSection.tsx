import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";

interface AchievementMeta {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const achievementsList: AchievementMeta[] = [
  { id: "course1", icon: Star, title: "Новичок", description: "Завершение первого курса" },
  { id: "course2", icon: Mountain, title: "Геолог-исследователь", description: "Изучены основы геологии" },
  { id: "course3", icon: HardHat, title: "Инженер добычи", description: "Пройден курс по методам добычи" },
  { id: "course4", icon: Crown, title: "Мастер нефтегазовой отрасли", description: "100% завершение курсов" },
  { id: "course5", icon: Medal, title: "Легенда нефтегаза", description: "90%+ правильных ответов во всех тестах" },
];

const AchievementsSection: React.FC = () => {
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>([]);

  useEffect(() => {
    const fetchEarned = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Ошибка загрузки достижений:", error);
      } else {
        setEarnedAchievements(data.map((a) => a.achievement_id));
      }
    };

    fetchEarned();
  }, []);

  return (
    <section className="py-16 bg-gray-50" id="achievements">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">🏆 Система достижений</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievementsList.map(({ id, icon: Icon, title, description }) => {
            const isEarned = earnedAchievements.includes(id);
            return (
              <div
                key={id}
                className={`flex flex-col items-center p-5 rounded-xl shadow-lg transition ${
                  isEarned ? "bg-yellow-100 border-2 border-yellow-400" : "bg-white"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    isEarned ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-center">{title}</h3>
                <p className="text-gray-600 text-sm text-center">{description}</p>
                {isEarned && (
                  <p className="text-xs text-yellow-700 font-semibold mt-2">
                    ✅ Получено
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
