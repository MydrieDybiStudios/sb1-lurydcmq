import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import { useNavigate } from "react-router-dom";

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    // обновление при изменении сессии
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try {
        (sub as any)?.subscription?.unsubscribe?.();
        (sub as any)?.unsubscribe?.();
      } catch {}
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка личного кабинета...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        onLogin={() => navigate("/")}
        onRegister={() => navigate("/")}
      />

      <main className="flex-grow container mx-auto px-4 py-10">
        {user ? (
          <>
            {/* ---- Раздел курсов ---- */}
            <section id="courses" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                🎓 Мои курсы
              </h2>
              <CoursesSection onStartCourse={() => {}} />
            </section>

            {/* ---- Раздел достижений ---- */}
            <section id="achievements">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                🏆 Мои достижения
              </h2>
              <AchievementsSection />
            </section>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto p-10 text-center border border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Доступ ограничен 🚫
            </h2>
            <p className="text-gray-700 mb-6">
              Для того, чтобы получить доступ к курсам и сохранению результата,
              войдите или зарегистрируйтесь на сайте.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition"
              >
                Войти
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-600 font-semibold py-2 px-6 rounded-lg transition"
              >
                Регистрация
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cabinet;
