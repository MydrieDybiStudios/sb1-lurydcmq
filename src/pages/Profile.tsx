import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Camera, Award, BookOpen, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import coursesData from "../data/coursesData";

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
  score: number;
  total: number;
  percentage: number;
  updated_at: string;
}

// ---------- Toast ----------
const Toast: React.FC<{
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}> = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-5 right-5 min-w-[220px] px-4 py-3 rounded-lg shadow-2xl text-white font-medium z-50 animate-slideInRight ${
        type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-pink-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? <Sparkles className="w-5 h-5" /> : <LucideIcons.AlertCircle className="w-5 h-5" />}
        {message}
      </div>
    </div>
  );
};

// ---------- Компонент профиля ----------
const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const navigate = useNavigate();
  const courseTitleMap = new Map(coursesData.map(c => [c.id, c.title]));

  // ---------- Загрузка данных ----------
  useEffect(() => {
    const fetchProfileData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Профиль
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        setToastType("error");
        setToastMessage("Ошибка загрузки профиля");
      } else if (!profileData) {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            first_name: "",
            last_name: "",
            class_num: 1,
            class_range: "1-8",
            avatar_url: null,
            updated_at: new Date().toISOString(),
          })
          .select();
      } else setProfile(profileData as ProfileData);

      // Прогресс
      const { data: progressData } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (progressData) setProgress(progressData);

      // Достижения
      const { data: userAchievements, error: achError } = await supabase
        .from("user_achievements")
        .select("*, achievements(title, description, icon)")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (!achError && userAchievements) {
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

    fetchProfileData();
  }, [navigate]);

  // ---------- Сохранение профиля ----------
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          class_num: profile.class_num,
          class_range: profile.class_range,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) throw error;

      setToastType("success");
      setToastMessage("Профиль успешно сохранён!");
    } catch (err) {
      console.error(err);
      setToastType("error");
      setToastMessage("Ошибка сохранения профиля!");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Загрузка аватара ----------
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setAvatarLoading(true);

    try {
      if (!file.type.startsWith("image/"))
        throw new Error("Можно загружать только изображения");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      if (!data?.publicUrl) throw new Error("Не удалось получить публичный URL");

      await supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: data.publicUrl }, { onConflict: "id" });
      setProfile((prev) =>
        prev ? { ...prev, avatar_url: data.publicUrl } : prev
      );

      setToastType("success");
      setToastMessage("Аватар успешно обновлён");
    } catch (err: any) {
      setToastType("error");
      setToastMessage(
        "Ошибка загрузки аватара: " + (err.message || "неизвестная ошибка")
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleBackToMenu = () => navigate("/");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Загружаем ваш профиль...</p>
      </div>
    </div>
  );
  
  if (!profile) return null;

  const classOptions =
    profile.class_range === "1-8"
      ? Array.from({ length: 8 }, (_, i) => i + 1)
      : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Основная карточка профиля */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Верхний градиентный акцент */}
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
          
          <div className="p-8">
            {/* Аватар и имя */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {avatarLoading ? (
                  <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <img
                      src={profile.avatar_url || "https://via.placeholder.com/150"}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-yellow-400/50 ring-offset-2 ring-offset-gray-900 shadow-2xl"
                    />
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full p-3 cursor-pointer shadow-lg transform hover:scale-110 transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <Camera className="w-5 h-5" />
                    </label>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-1">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-yellow-400 font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {profile.class_num} класс
              </p>
            </div>

            {/* Поля ввода */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile((p) => p && { ...p, first_name: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="Имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Фамилия</label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile((p) => p && { ...p, last_name: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  placeholder="Фамилия"
                />
              </div>
            </div>

            {/* Переключатель классов */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm font-medium text-gray-300 mb-3">Диапазон классов</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${profile.class_range === "1-8" ? "text-yellow-400 font-bold" : "text-gray-400"}`}>1–8</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.class_range === "8-11"}
                    onChange={() =>
                      setProfile((p) =>
                        p && {
                          ...p,
                          class_range: p.class_range === "1-8" ? "8-11" : "1-8",
                          class_num: p.class_range === "1-8" ? 8 : 1,
                        }
                      )
                    }
                  />
                  <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-yellow-600 transition-all"></div>
                  <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-7"></div>
                </label>
                <span className={`text-sm ${profile.class_range === "8-11" ? "text-yellow-400 font-bold" : "text-gray-400"}`}>8–11</span>
              </div>
            </div>

            {/* Выбор класса */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Класс</label>
              <select
                value={profile.class_num}
                onChange={(e) =>
                  setProfile((p) => p && { ...p, class_num: Number(e.target.value) })
                }
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
              >
                {classOptions.map((num) => (
                  <option key={num} value={num} className="bg-gray-800">
                    {num} класс
                  </option>
                ))}
              </select>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
              <button
                onClick={handleBackToMenu}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                Главное меню
              </button>
            </div>

            {/* Прогресс */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="text-yellow-400" />
                Прогресс по курсам
              </h2>
              {progress.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
                  <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Пока нет данных о прогрессе</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {progress.map((p) => (
                    <div
                      key={p.course_id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white group-hover:text-yellow-400 transition">
                          {courseTitleMap.get(+p.course_id) || `Курс ${p.course_id}`}
                        </h3>
                        <span className="text-sm text-yellow-400 font-bold">{p.percentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Баллы: {p.score}/{p.total}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(p.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                          style={{ width: `${p.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Достижения */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="text-yellow-400" />
                Достижения
              </h2>
              {achievements.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
                  <Award className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Пока нет достижений</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {achievements.map((a, index) => {
                    const IconComponent = (LucideIcons as any)[a.icon] || LucideIcons.Award;
                    return (
                      <div
                        key={a.id}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-200 group animate-fadeIn"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                            <IconComponent className="w-6 h-6 text-yellow-400" />
                          </div>
                          <p className="font-semibold text-white text-sm mb-1">{a.title}</p>
                          <p className="text-xs text-gray-400">{a.description}</p>
                          <p className="text-[10px] text-yellow-400/70 mt-2">
                            {new Date(a.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
