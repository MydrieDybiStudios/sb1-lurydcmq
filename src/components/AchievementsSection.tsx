import React, { useEffect, useState } from "react";
import { Star, Mountain, HardHat, Crown, Medal } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import "../index.css";

type AchievementMeta = {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
};

const iconToEmoji = (icon?: string) => {
  if (!icon) return "🏅";
  const key = icon.toLowerCase();
  if (key.includes("star")) return "⭐";
  if (key.includes("mountain")) return "⛰️";
  if (key.includes("hard") || key.includes("hat") || key.includes("hard-hat")) return "⛏️";
  if (key.includes("crown")) return "👑";
  if (key.includes("medal")) return "🏅";
  return icon; // если уже эмодзи или неизвестно — отобразим как есть
};

const lucideFor = (icon?: string) => {
  if (!icon) return Star;
  const key = icon.toLowerCase();
  if (key.includes("star")) return Star;
  if (key.includes("mountain")) return Mountain;
  if (key.includes("hard") || key.includes("hat") || key.includes("hard-hat")) return HardHat;
  if (key.includes("crown")) return Crown;
  if (key.includes("medal")) return Medal;
  return Star;
};

const AchievementsSection: React.FC = () => {
  const [allAchievements, setAllAchievements] = useState<AchievementMeta[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // get user
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Ошибка получения пользователя:", error.message);
        setLoading(false);
        return;
      }
      if (data?.user) setUserId(data.user.id);
      else setUserId(null);
    };
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUserId(session.user.id);
      else {
        setUserId(null);
        setEarnedIds([]);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // fetch all achievements + user's earned ids
  useEffect(() => {
    let sub: any;

    const fetchAll = async () => {
      setLoading(true);
      // загрузим справочник достижений
      const { data: all, error: allErr } = await supabase.from("achievements").select("id, title, description, icon").order("id", { ascending: true });
      if (allErr) {
        console.error("Ошибка загрузки achievements:", allErr.message);
      } else {
        setAllAchievements(all || []);
      }

      // если юзер есть — загрузим его достижения
      if (userId) {
        const { data: uach, error: uErr } = await supabase
          .from("user_achievements")
          .select("achievement_id")
          .eq("user_id", userId);

        if (uErr) {
          console.error("Ошибка загрузки user_achievements:", uErr.message);
        } else {
          setEarnedIds((uach || []).map((r: any) => Number(r.achievement_id)));
        }

        // realtime подписка на изменения user_achievements для данного user
        sub = supabase
          .channel(`public:user_achievements:user=${userId}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "user_achievements", filter: `user_id=eq.${userId}` },
            (payload) => {
              // payload.eventType = INSERT | UPDATE | DELETE
              // Перезагружаем список earnedIds (корректно и быстро)
              if (payload.eventType === "INSERT") {
                const aid = Number(payload.record.achievement_id);
                setEarnedIds((prev) => (prev.includes(aid) ? prev : [...prev, aid]));
              } else if (payload.eventType === "DELETE") {
                const aid = Number(payload.old.achievement_id);
                setEarnedIds((prev) => prev.filter((x) => x !== aid));
              } else if (payload.eventType === "UPDATE") {
                // для простоты — перезагрузим текущие
                // можно обработать конкретно если нужно
                (async () => {
                  const { data: uach2 } = await supabase.from("user_achievements").select("achievement_id").eq("user_id", userId);
                  setEarnedIds((uach2 || []).map((r: any) => Number(r.achievement_id)));
                })();
              }
            }
          )
          .subscribe();
      } else {
        setEarnedIds([]);
      }

      setLoading(false);
    };

    fetchAll();

    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [userId]);

  return (
    <section id="achievements" className="py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Система достижений</h2>

        {loading ? (
          <p className="text-center text-gray-500">Загрузка...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {allAchievements.map((a) => {
              const isEarned = earnedIds.includes(a.id);
              const Icon = lucideFor(a.icon || undefined);
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg text-center transition transform hover:-translate-y-1 ${
                    isEarned
                      ? "bg-yellow-100 border-2 border-yellow-400 shadow-[0_0_24px_rgba(255,215,0,0.45)] animate-glow"
                      : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      isEarned ? "bg-yellow-500 text-black scale-110 shadow-[0_0_18px_rgba(255,215,0,0.8)]" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {/* если icon — эмодзи, показываем его; иначе lucide */}
                    {a.icon && a.icon.length <= 2 ? (
                      <span className="text-2xl">{a.icon}</span>
                    ) : (
                      <Icon className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="font-bold mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
