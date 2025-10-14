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
  RefreshCw
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

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
  'compass': Compass
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

  // Получаем пользователя и данные параллельно для оптимизации
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Получаем пользователя
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData?.user) {
          setUserId(userData.user.id);
          
          // Параллельно загружаем достижения и полученные ачивки
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

  // Обновляем достижения при изменении (для real-time)
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
          // Обновляем список полученных достижений
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

  // Функция для перезагрузки достижений
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

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500">Загрузка достижений...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="achievements" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Достижения</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Получайте достижения за прохождение курсов и демонстрируйте свой прогресс в обучении
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 mb-2">{error}</p>
            <button
              onClick={refetchAchievements}
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!userId ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto border-2 border-dashed border-gray-300">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Войдите в аккаунт
              </h3>
              <p className="text-gray-500 mb-4">
                Чтобы увидеть свои достижения, войдите в систему
              </p>
            </div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto border-2 border-dashed border-gray-300">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Достижений пока нет
              </h3>
              <p className="text-gray-500">
                Начните проходить курсы, чтобы получить первые достижения!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Статистика */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{earned.length}</div>
                  <div className="text-sm text-gray-600">Получено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{achievements.length}</div>
                  <div className="text-sm text-gray-600">Всего достижений</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((earned.length / achievements.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Прогресс</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(earned.length / achievements.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Сетка достижений */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map(({ id, title, description, icon }) => {
                const earnedNow = earned.includes(id);
                const Icon = iconsMap[icon] || Crown;
                return (
                  <div
                    key={id}
                    className={`p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                      earnedNow
                        ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-lg shadow-yellow-200"
                        : "bg-white border border-gray-200 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transition-all ${
                        earnedNow
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-400 scale-110"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
                    <div className={`mt-3 text-xs font-medium ${earnedNow ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {earnedNow ? (
                        <span className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Получено
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Lock className="w-4 h-4 mr-1" />
                          Не получено
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Кнопка обновления */}
            <div className="text-center mt-8">
              <button
                onClick={refetchAchievements}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
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
