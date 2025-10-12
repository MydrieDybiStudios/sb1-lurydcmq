import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

// ---------- Типы ----------
interface ProfileData {
  first_name: string;
  last_name: string;
  class_num: number;
  class_range: "1-8" | "8-11";
  avatar_url: string | null;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

interface ProgressItem {
  course_id: string;
  course_name: string;
  score: number;
  total: number;
  percentage: number;
  updated_at: string;
}

// ---------- Список достижений ----------
const achievementsList = [
  { id: 1, title: "Новичок", description: "Завершение первого курса", icon: "⭐" },
  { id: 2, title: "Геолог-исследователь", description: "Изучены основы геологии", icon: "⛰️" },
  { id: 3, title: "Инженер добычи", description: "Пройден курс по методам добычи", icon: "⛏️" },
  { id: 4, title: "Мастер нефтегазовой отрасли", description: "100% завершение курсов", icon: "👑" },
  { id: 5, title: "Легенда нефтегаза", description: "90%+ правильных ответов во всех тестах", icon: "🥇" },
  { id: 6, title: "Проходец месторождений", description: "Набрано 100 очков", icon: "🚀" },
  { id: 7, title: "Нефтяной эксперт", description: "Набрано 300 очков", icon: "💼" },
  { id: 8, title: "Главный инженер", description: "Набрано 500 очков", icon: "🏗️" },
];

// ---------- Ранги ----------
const getRank = (points: number) => {
  if (points >= 500) return "🏆 Легенда нефти";
  if (points >= 300) return "💼 Эксперт отрасли";
  if (points >= 200) return "🛢️ Инженер";
  if (points >= 100) return "🔩 Проходец месторождений";
  return "👷 Ученик нефтяник";
};

// ---------- Компонент ----------
const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const navigate = useNavigate();

  // ---------- Основная загрузка ----------
  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // 1️⃣ Профиль
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);

      // 2️⃣ Прогресс (join с курсами)
      const { data: progressData } = await supabase
        .from("progress")
        .select("*, courses(name)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (progressData) {
        const mapped = progressData.map((p: any) => ({
          course_id: p.course_id,
          course_name: p.courses?.name || `Курс ${p.course_id}`,
          score: p.score,
          total: p.total,
          percentage: p.percentage,
          updated_at: p.updated_at,
        }));
        setProgress(mapped);
        const total = mapped.reduce((sum: number, x: ProgressItem) => sum + x.score, 0);
        setTotalPoints(total);
      }

      // 3️⃣ Достижения
      const { data: userAchievements } = await supabase
        .from("user_achievements")
        .select("*, achievements(title, description, icon)")
        .eq("user_id", user.id);

      if (userAchievements) {
        setAchievements(
          userAchievements.map((a: any) => ({
            id: a.achievement_id,
            title: a.achievements.title,
            description: a.achievements.description,
            icon: a.achievements.icon,
            earned_at: a.earned_at,
          }))
        );
      }

      setLoading(false);
    };
    fetchAll();
  }, [navigate]);

  // ---------- Автовыдача достижений ----------
  useEffect(() => {
    if (!profile || !totalPoints) return;
    const checkAchievements = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existing = achievements.map((a) => a.title);

      for (const ach of achievementsList) {
        let shouldGrant = false;

        if (ach.id === 1 && progress.length > 0) shouldGrant = true;
        if (ach.id === 2 && progress.some(p => p.course_name.toLowerCase().includes("геология"))) shouldGrant = true;
        if (ach.id === 3 && progress.some(p => p.course_name.toLowerCase().includes("добыч"))) shouldGrant = true;
        if (ach.id === 4 && progress.every(p => p.percentage === 100)) shouldGrant = true;
        if (ach.id === 5 && progress.every(p => p.percentage >= 90)) shouldGrant = true;
        if (ach.id === 6 && totalPoints >= 100) shouldGrant = true;
        if (ach.id === 7 && totalPoints >= 300) shouldGrant = true;
        if (ach.id === 8 && totalPoints >= 500) shouldGrant = true;

        if (shouldGrant && !existing.includes(ach.title)) {
          await supabase.from("user_achievements").insert({
            user_id: user.id,
            achievement_id: ach.id,
            earned_at: new Date().toISOString(),
          });
          setToast({ msg: `🎉 Получено достижение: ${ach.title}!`, type: "success" });
        }
      }
    };

    checkAchievements();
  }, [totalPoints, achievements, progress]);

  if (loading) return <div className="text-center p-8">Загрузка...</div>;
  if (!profile) return null;

  const rank = getRank(totalPoints);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 relative">
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h1>
        <p className="text-lg text-gray-700">{rank}</p>

        <div className="mt-2 text-gray-600">
          🎯 Всего очков: <span className="font-bold text-yellow-600">{totalPoints}</span>
        </div>

        {/* ---------- Прогресс ---------- */}
        <div className="w-full mt-6 bg-gray-50 rounded-2xl p-4 border border-yellow-200">
          <h2 className="text-xl font-semibold mb-3">📘 Прогресс по курсам</h2>
          {progress.length === 0 ? (
            <p className="text-gray-500">Нет данных</p>
          ) : (
            <div className="space-y-2">
              {progress.map((p) => (
                <div key={p.course_id} className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div>
                    <p className="font-semibold">{p.course_name}</p>
                    <p className="text-sm text-gray-500">Баллы: {p.score}/{p.total}</p>
                  </div>
                  <p className="text-yellow-600 font-bold">{p.percentage}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Достижения ---------- */}
        <div className="w-full mt-6 bg-gray-50 rounded-2xl p-4 border border-yellow-200">
          <h2 className="text-xl font-semibold mb-3">🏆 Мои достижения</h2>
          {achievements.length === 0 ? (
            <p className="text-gray-500">Пока нет достижений 😅</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col items-center bg-white p-3 rounded-xl shadow hover:shadow-md transition"
                >
                  <span className="text-3xl">{a.icon}</span>
                  <p className="text-sm font-bold mt-1">{a.title}</p>
                  <p className="text-xs text-gray-500 text-center">{a.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
