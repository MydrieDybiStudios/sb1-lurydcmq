import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Загружаем данные пользователя
  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, email")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();
  }, []);

  // Загрузка аватарки
  async function uploadAvatar() {
    if (!avatarFile || !profile) return;

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${profile.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      alert("Ошибка загрузки: " + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile.id);

    setAvatarUrl(publicUrl);
    alert("Аватар обновлён!");
  }

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;
  if (!profile) return <p className="text-center mt-10">Профиль не найден</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Профиль пользователя</h1>

      <div className="flex flex-col items-center">
        <img
          src={
            avatarUrl ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Аватар"
          className="w-32 h-32 rounded-full object-cover border mb-4"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <button
          onClick={uploadAvatar}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg mb-4"
        >
          Загрузить аватар
        </button>

        <div className="text-left w-full space-y-2">
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Имя пользователя:</strong> {profile.username}</p>
        </div>
      </div>
    </div>
  );
}
