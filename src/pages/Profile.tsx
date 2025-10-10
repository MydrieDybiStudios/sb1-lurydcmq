import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  first_name: string;
  last_name: string;
  class_num: number;
  class_range: "1-8" | "8-11";
  avatar_url: string | null;
}

// Кастомный toast
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
      className={`
        fixed top-5 right-5 min-w-[200px] px-4 py-2 rounded-lg shadow-lg text-white font-medium
        transition-transform transform
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
    >
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
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

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

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setToastType("error");
      setToastMessage("Ошибка загрузки аватара");
      setAvatarLoading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : prev);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);

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

  const classOptions =
    profile.class_range === "1-8"
      ? Array.from({ length: 8 }, (_, i) => i + 1)
      : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 relative">
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="flex flex-col items-center">
        <div className="relative">
          {avatarLoading ? (
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img
              src={profile.avatar_url || "https://via.placeholder.com/100"}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          )}
          <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v8m0-8V7m0 4h4m-4 0H8" />
            </svg>
          </label>
        </div>

        <h1 className="mt-4 text-xl font-semibold text-gray-800">
          {profile.first_name} {profile.last_name}
        </h1>
      </div>

      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Имя"
          value={profile.first_name}
          onChange={(e) =>
            setProfile((p) => p && { ...p, first_name: e.target.value })
          }
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={profile.last_name}
          onChange={(e) =>
            setProfile((p) => p && { ...p, last_name: e.target.value })
          }
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-sm">1–8</span>
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
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-500"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
        </label>
        <span className="text-sm">8–11</span>
      </div>

      <div className="mt-4">
        <select
          value={profile.class_num}
          onChange={(e) =>
            setProfile((p) => p && { ...p, class_num: Number(e.target.value) })
          }
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {classOptions.map((num) => (
            <option key={num} value={num}>
              {num} класс
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {saving ? "Сохранение..." : "Сохранить изменения"}
      </button>

      <button
        onClick={handleLogout}
        className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
      >
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default Profile;
