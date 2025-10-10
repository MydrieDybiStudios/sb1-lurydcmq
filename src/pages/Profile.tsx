import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import AchievementsSection from "./AchievementsSection";

interface ProfileData {
  first_name: string;
  last_name: string;
  class_num: number;
  class_range: "1-8" | "8-11";
  avatar_url: string | null;
  achievements?: string[]; // список id достижений
}

// Кастомный toast
const Toast: React.FC<{ message: string; type?: "success" | "error"; onClose: () => void; duration?: number }> = ({ message, type = "success", onClose, duration = 3000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  return (
    <div className={`fixed top-5 right-5 min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-transform transform ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setToastType("error");
        setToastMessage("Ошибка загрузки профиля");
      } else setProfile(data as ProfileData);

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });

    setSaving(false);

    if (error) {
      setToastType("error");
      setToastMessage("Ошибка сохранения профиля!");
    } else {
      setToastType("success");
      setToastMessage("Профиль обновлён!");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setAvatarLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      setToastType("error");
      setToastMessage("Ошибка загрузки аватара");
      setAvatarLoading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile((prev) => prev ? { ...prev, avatar_url: data.publicUrl } : prev);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);

    setToastType("success");
    setToastMessage("Аватар успешно обновлён");
    setAvatarLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile) return null;

  const classOptions = profile.class_range === "1-8" ? Array.from({ length: 8 }, (_, i) => i + 1) : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-gray-200 relative">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Левый блок — аватар и имя */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <div className="relative">
            {avatarLoading ? (
              <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img src={profile.avatar_url || "https://via.placeholder.com/100"} alt="Avatar" className="w-28 h-28 rounded-full object-cover shadow-md" />
            )}
            <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 cursor-pointer transition">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v8m0-8V7m0 4h4m-4 0H8" />
              </svg>
            </label>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h1>
        </div>

        {/* Правый блок — настройки */}
        <div className="flex-1 w-full md:w-2/3 space-y-6">
          {/* Имя и фамилия */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Имя" value={profile.first_name} onChange={(e) => setProfile(p => p && { ...p, first_name: e.target.value })} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            <input type="text" placeholder="Фамилия" value={profile.last_name} onChange={(e) => setProfile(p => p && { ...p, last_name: e.target.value })} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>

          {/* Диапазон класса */}
          <div className="flex items-center gap-4">
            <span>1–8</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={profile.class_range === "8-11"} onChange={() => setProfile(p => p && ({ ...p, class_range: p.class_range === "1-8" ? "8-11" : "1-8", class_num: p.class_range === "1-8" ? 8 : 1 }))} />
              <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-yellow-500"></div>
              <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-full"></div>
            </label>
            <span>8–11</span>
          </div>

          {/* Выбор класса */}
          <select value={profile.class_num} onChange={e => setProfile(p => p && ({ ...p, class_num: Number(e.target.value) }))} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
            {classOptions.map(num => <option key={num} value={num}>{num} класс</option>)}
          </select>

          <div className="flex gap-4">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50">
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>
            <button onClick={handleLogout} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition">Выйти</button>
          </div>
        </div>
      </div>

      {/* Достижения */}
      <div className="mt-12">
        <AchievementsSection />
      </div>
    </div>
  );
};

export default Profile;
