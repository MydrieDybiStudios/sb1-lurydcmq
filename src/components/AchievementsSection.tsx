// src/components/AchievementsSection.tsx
import React, { useEffect, useState } from "react";
import { 
  Star, 
  Mountain, 
  HardHat, 
  Crown, 
  Medal, 
  GraduationCap, 
  Search, 
  Drill, 
  Leaf, 
  FlaskConical, 
  Compass,
  CheckCircle,
  Lock,
  RefreshCw,
  BookOpen,
  History,
  Truck,
  Cpu,
  Database,
  Layers,
  Shield,
  TreePine,
  Wind,
  ClipboardList,
  Award,
  Trophy,
  Sparkles,
  Target
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// Карта иконок (расширена новыми)
const iconsMap: Record<string, any> = {
  'star': Star,
  'mountain': Mountain,
  'hard-hat': HardHat,
  'crown': Crown,
  'medal': Medal,
  'graduation-cap': GraduationCap,
  'search': Search,
  'drill': Drill,
  'leaf': Leaf,
  'flask': FlaskConical,
  'compass': Compass,
  'book': BookOpen,
  'history': History,
  'truck': Truck,
  'cpu': Cpu,
  'database': Database,
  'layers': Layers,
  'shield': Shield,
  'tree': TreePine,
  'wind': Wind,
  'clipboard': ClipboardList,
  'award': Award,
  'trophy': Trophy,
  'sparkles': Sparkles,
  'target': Target
};

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  course_key: string | null;
  name: string;
  created_at: string;
}

const AchievementsSection: React.FC = () => {
  const [earned, setEarned] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData?.user) {
          setUserId(userData.user.id);
          
          const [achievementsResponse, earnedResponse] = await Promise.all([
            supabase.from("achievements").select("*").order("id", { ascending: true }),
            supabase.from("user_achievements").select("achievement_id").eq("user_id", userData.user.id)
          ]);

          if (achievementsResponse.error) throw achievementsResponse.error;
          if (earnedResponse.error) throw earnedResponse.error;

          if (achievementsResponse.data) setAchievements(achievementsResponse.data);
          if (earnedResponse.data) {
            setEarned(earnedResponse.data.map((a) => a.achievement_id));
          }
        }
      } catch (err: any) {
        console.error("Ошибка загрузки достижений:", err);
        setError("Не удалось загрузить достижения. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel('user_achievements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          const { data, error } = await supabase
            .from("user_achievements")
            .select("achievement_id")
            .eq("user_id", userId);

          if (!error && data) {
            setEarned(data.map((a) => a.achievement_id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const refetchAchievements = async () => {
    if (!userId) return;
    
    try {
      setError(null);
      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      if (error) throw error;
      if (data) setEarned(data.map((a) => a.achievement_id));
    } catch (err: any) {
      console.error("Ошибка обновления достижений:", err);
      setError("Не удалось обновить достижения");
    }
  };

  // Анимированный счётчик (для красоты можно добавить, но пока оставим просто числа)
  const earnedCount = earned.length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Загружаем ваши достижения...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Декоративные фоновые элементы */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-400">
            Достижения
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Получайте награды за прохождение курсов и демонстрируйте свой прогресс в обучении
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center max-w-md mx-auto backdrop-blur-sm">
            <p className="text-red-700 mb-2">{error}</p>
            <button
              onClick={refetchAchievements}
              className="text-red-600 hover:text-red-800 underline text-sm font-medium"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!userId ? (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 max-w-md mx-auto border border-gray-200 shadow-xl">
              <div className="relative">
                <Crown className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-ping" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Войдите в аккаунт
              </h3>
              <p className="text-gray-500 mb-6">
                Чтобы увидеть свои достижения и следить за прогрессом, войдите в систему
              </p>
            </div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 max-w-md mx-auto border border-gray-200 shadow-xl">
              <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Достижений пока нет
              </h3>
              <p className="text-gray-500">
                Начните проходить курсы, чтобы получить первые награды!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Статистика */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Получено</p>
                    <p className="text-3xl font-bold text-gray-900">{earnedCount}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Всего</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Target className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Прогресс</p>
                    <p className="text-3xl font-bold text-gray-900">{progressPercent}%</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Sparkles className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Прогресс</span>
                <span>{earnedCount} из {totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Сетка достижений */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map(({ id, title, description, icon }) => {
                const earnedNow = earned.includes(id);
                const Icon = iconsMap[icon] || Crown;

                return (
                  <div
                    key={id}
                    className={`group relative rounded-2xl p-6 transition-all duration-500 transform hover:-translate-y-2 ${
                      earnedNow
                        ? "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border-2 border-yellow-400 shadow-xl shadow-yellow-200/50"
                        : "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {/* Блеск для полученных */}
                    {earnedNow && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl"></div>
                        <div className="absolute -top-2 -right-2">
                          <Sparkles className="w-5 h-5 text-yellow-500 animate-ping" />
                        </div>
                      </>
                    )}

                    {/* Иконка */}
                    <div className="relative mb-4">
                      <div
                        className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto transition-all duration-500 ${
                          earnedNow
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-400/50 group-hover:scale-110 group-hover:rotate-3"
                            : "bg-gray-200 text-gray-400 group-hover:bg-gray-300 group-hover:text-gray-600"
                        }`}
                      >
                        <Icon className="w-10 h-10" />
                      </div>
                      {earnedNow && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Текст */}
                    <h3 className="font-bold text-lg mb-2 text-gray-900 text-center">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-center mb-4">{description}</p>

                    {/* Статус */}
                    <div className={`mt-3 text-xs font-medium text-center ${earnedNow ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {earnedNow ? (
                        <span className="flex items-center justify-center bg-yellow-50 py-1 px-3 rounded-full w-fit mx-auto">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Получено
                        </span>
                      ) : (
                        <span className="flex items-center justify-center bg-gray-100 py-1 px-3 rounded-full w-fit mx-auto">
                          <Lock className="w-3 h-3 mr-1" />
                          Не получено
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Кнопка обновления */}
            <div className="text-center mt-12">
              <button
                onClick={refetchAchievements}
                className="bg-black hover:bg-gray-900 text-yellow-400 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center mx-auto group"
              >
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Обновить достижения
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
