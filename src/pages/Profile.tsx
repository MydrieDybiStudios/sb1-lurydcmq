import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";

type ProfileData = {
  first_name: string;
  last_name: string;
  class_num: number;
  class_range: "1-8" | "8-11";
  avatar_url: string | null;
};

type EarnedAchievement = {
  achievement_id: number;
  created_at: string | null;
  achievements: {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
  };
};

const lucideFor = (icon?: string) => {
  if (!icon) return Star;
  const key = icon.toLowerCase();
  if (key.includes("mountain")) return Mountain;
  if (key.includes("hard") || key.includes("hat")) return HardHat;
  if (key.includes("crown")) return Crown;
  if (key.includes("medal")) return Medal;
  return Star;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [earned, setEarned] = useState<
    {
      id: number;
      title: string;
      description?: string | null;
      icon?: string | null;
      earned_at?: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const navigate = useNavigate();

  // -------- Инициализация --------
  useEffect(() => {
    let subscription: any;

    const fetchData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Загружаем профиль
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (prof) setProfile(prof as ProfileData);

      // Загружаем полученные достижения
      const { data: achData, error: achErr } = await supabase
        .from("user_achievements")
        .select("achievement_id, created_at, achievements(id, title, description, icon)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!achErr && achData) {
        const mapped = (achData as EarnedAchievement[]).map((r) => ({
          id: Number(r.achievements?.id ?? r.achievement_id),
          title: r.achievements?.title ?? "Неизвестное достижение",
          description: r.achievements?.description ?? "",
          icon: r.achievements?.icon ?? null,
          earned_at: r.created_at ?? null,
        }));
        setEarned(mapped);
      }

      // Подписка на realtime (чтобы новые достижения появлялись мгновенно)
      subscription = supabase
        .channel("realtime:user_achievements")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_achievements",
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            const { eventType, record } = payload;

            if (eventType === "INSERT" && record) {
              const { data: newRow } = await supabase
                .from("user_achievements")
                .select("achievement_id, created_at, achievements(id, title, description, icon)")
                .eq("id", record.id)
                .single();

              if (newRow) {
                const newItem = {
                  id: Number(newRow.achievements?.id ?? newRow.achievement_id),
                  title: newRow.achievements?.title ?? "Неизвестное достижение",
                  description: newRow.achievements?.description ?? "",
                  icon: newRow.achievements?.icon ?? null,
                  earned_at: newRow.created_at ?? null,
                };

                setEarned((prev) =>
                  prev.some((p) => p.id === newItem.id)
                    ? prev
                    : [newItem, ...prev]
                );
              }
            } else if (eventType === "DELETE") {
              const removedId = Number(payload.old?.achievement_id);
              setEarned((prev) => prev.filter((a) => a.id !== removedId));
            }
          }
        )
        .subscribe();

      setLoading(false);
    };

    fetchData();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [navigate]);

  // -------- Сохранение профиля --------
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setToastType("success");
      setToastMessage("Профиль успешно сохранён!");
    } catch (err) {
      setToastType("error");
      setToastMessage("Ошибка сохранения профиля!");
    } finally {
      setSaving(false);
    }
  };

  // -------- Загрузка аватара --------
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
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      await supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: data.publicUrl }, { onConflict: "id" });
      setProfile((p) => (p ? { ...p, avatar_url: data.publicUrl } : p));
      setToastType("success");
      setToastMessage("Аватар обновлён!");
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err.message || "Ошибка загрузки аватара");
    } finally {
      setAvatarLoading(false);
    }
  };

  // -------- UI --------
  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 relative">
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-white font-medium ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
          onAnimationEnd={() => setToastMessage(null)}
        >
          {toastMessage}
        </div>
      )}

      {/* ---------- Аватар и данные ---------- */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          {avatarLoading ? (
            <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <img
              src={profile.avatar_url || "https://via.placeholder.com/100"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-yellow-400"
            />
          )}
          <label className="absolute bottom-0 right-0 bg-yellow-500 text-white rounded-full p-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11v8m0-8V7m0 4h4m-4 0H8"
              />
            </svg>
          </label>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          {profile.first_name} {profile.last_name}
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) =>
              setProfile((p) => p && { ...p, first_name: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) =>
              setProfile((p) => p && { ...p, last_name: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-yellow-500 py-2 rounded-lg text-black font-semibold hover:bg-yellow-600"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {/* ---------- Достижения ---------- */}
        <div className="w-full mt-8 bg-gray-50 rounded-2xl p-4 border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🏆 Мои достижения
          </h2>

          {earned.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              Пока нет достижений 😅
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {earned.map((a) => {
                const Icon = lucideFor(a.icon || undefined);
                return (
                  <div
                    key={a.id}
                    className="relative flex flex-col items-center bg-white p-3 rounded-xl shadow-md hover:shadow-xl transform transition"
                  >
                    <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-black shadow-[0_0_18px_rgba(255,215,0,0.7)] scale-105">
                      {a.icon && a.icon.length <= 2 ? (
                        <span className="text-2xl">{a.icon}</span>
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-700 text-center">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {a.description}
                    </p>
                    {a.earned_at && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(a.earned_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------- Кнопка главного меню ---------- */}
        <div className="mt-6 flex justify-center w-full">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition"
          >
          Главное меню
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
