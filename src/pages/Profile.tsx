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
      className={`fixed top-5 right-5 min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-transform transform ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
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

  // Загрузка профиля
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 — Not Found
        setToastType("error");
        setToastMessage("Ошибка загрузки профиля");
      } else if (!data) {
        // Если профиля нет, создаём через upsert
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              first_name: "",
              last_name: "",
              class_num: 1,
              class_range: "1-8",
              avatar_url: null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        if (upsertError) {
          setToastType("error");
          setToastMessage("Ошибка создания профиля");
        } else {
          setProfile({
            first_name: "",
            last_name: "",
            class_num: 1,
            class_range: "1-8",
            avatar_url: null,
          });
        }
      } else setProfile(data as ProfileData);

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  // Сохранение профиля через upsert
  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
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

  // Загрузка аватара
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setAvatarLoading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Можно загружать только изображения");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Загружаем в bucket avatars
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      if (!data?.publicUrl) throw new Error("Не удалось получить публичный URL");

      // Обновляем профиль
      setProfile((prev) => (prev ? { ...prev, avatar_url: data.publicUrl } : prev));
      await supabase.from("profiles").upsert({ id: user.id, avatar_url: data.publicUrl }, { onConflict: "id" });

      setToastType("success");
      setToastMessage("Аватар успешно обновлён");
    } catch (err: any) {
      console.error("Ошибка загрузки аватара:", err.message || err);
      setToastType("error");
      setToastMessage("Ошибка загрузки аватара: " + (err.message || "неизвестная ошибка"));
    } finally {
      setAvatarLoading(false);
    }
  };

  // Кнопка возврата в главное меню
  const handleBackToMenu = () => {
    navigate("/"); // просто переходим на главную
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile) return null;

  const classOptions =
    profile.class_range === "1-8"
      ? Array.from({ length: 8 }, (_, i) => i + 1)
      : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 relative">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}

      <div className="flex flex-col items-center gap-6">
        {/* Аватар */}
        <div className="relative group">
          {avatarLoading ? (
            <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="31.4" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <img
              src={profile.avatar_url || "https://via.placeholder.com/100"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-yellow-400 group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 cursor-pointer transition transform hover:scale-110">
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v8m0-8V7m0 4h4m-4 0H8" />
            </svg>
          </label>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          {profile.first_name} {profile.last_name}
        </h1>

        {/* Поля ввода */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Имя"
            value={profile.first_name}
            onChange={(e) => setProfile((p) => p && ({ ...p, first_name: e.target.value }))}
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={profile.last_name}
            onChange={(e) => setProfile((p) => p && ({ ...p, last_name: e.target.value }))}
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Диапазон и класс */}
        <div className="flex items-center gap-4 w-full justify-between">
          <span>1–8</span>
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
            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-yellow-500"></div>
            <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-full"></div>
          </label>
          <span>8–11</span>
        </div>

        <select
          value={profile.class_num}
          onChange={(e) => setProfile((p) => p && ({ ...p, class_num: Number(e.target.value) }))}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {classOptions.map((num) => (
            <option key={num} value={num}>
              {num} класс
            </option>
          ))}
        </select>

        {/* Кнопки */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            onClick={handleBackToMenu}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
          >
            Главное меню
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
