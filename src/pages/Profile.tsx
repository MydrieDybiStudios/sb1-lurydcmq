import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";

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
      className={`fixed top-5 right-5 min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-transform transform ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

// ---------- Карта иконок ----------
const iconsMap: Record<string, any> = {
  Star,
  Mountain,
  HardHat,
  Crown,
  Medal,
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

  // ---------- Загрузка профиля, достижений и прогресса ----------
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

      // Прогресс по курсам
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

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile) return null;

  const classOptions =
    profile.class_range === "1-8"
      ? Array.from({ length: 8 }, (_, i) => i + 1)
      : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 relative">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="flex flex-col items-center gap-6">
        {/* ---------- Аватар ---------- */}
        {/* ... остальная часть без изменений ... */}

        {/* ---------- Достижения ---------- */}
        <div className="w-full mt-8 bg-gray-50 rounded-2xl p-4 border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🏆 Мои достижения
          </h2>

          {achievements.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              Пока нет достижений 😅
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((a, index) => {
                const IconComponent = iconsMap[a.icon] || Star; // ✅ Подставляем иконку из карты

                return (
                  <div
                    key={a.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className="relative flex flex-col items-center bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition transform animate-fade-in-up"
                  >
                    {/* ✅ отображаем lucide-react иконку */}
                    <div className="mb-2 p-2 bg-yellow-100 rounded-full shadow">
                      <IconComponent className="w-6 h-6 text-yellow-600" />
                    </div>

                    <p className="text-sm font-bold text-gray-700 text-center">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {a.description}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(a.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
