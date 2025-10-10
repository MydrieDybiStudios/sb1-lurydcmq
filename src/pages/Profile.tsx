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

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/"); // если не авторизован — редиректим
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Ошибка загрузки профиля:", error);
      } else if (data) {
        setProfile(data as ProfileData);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Ошибка сохранения профиля:", error);
    } else {
      alert("✅ Профиль обновлён");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile((prev) => prev ? { ...prev, avatar_url: data.publicUrl } : prev);
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile) return null;

  const classOptions =
    profile.class_range === "1-8"
      ? Array.from({ length: 8 }, (_, i) => i + 1)
      : Array.from({ length: 4 }, (_, i) => i + 8);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>

      {/* Аватар */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={profile.avatar_url || "https://via.placeholder.com/100"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <label className="cursor-pointer text-yellow-600 hover:underline">
          Изменить аватар
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </label>
      </div>

      {/* Имя / фамилия */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Имя"
          value={profile.first_name}
          onChange={(e) =>
            setProfile((p) => p && { ...p, first_name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={profile.last_name}
          onChange={(e) =>
            setProfile((p) => p && { ...p, last_name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Тумблер диапазона */}
      <div className="flex justify-between items-center mt-4">
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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-yellow-500"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
        </label>
        <span>8–11</span>
      </div>

      {/* Выбор класса */}
      <div className="mt-4">
        <select
          value={profile.class_num}
          onChange={(e) =>
            setProfile((p) => p && { ...p, class_num: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
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
        className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
      >
        Сохранить
      </button>
    </div>
  );
};

export default Profile;
