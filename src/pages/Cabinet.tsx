// src/pages/Cabinet.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import coursesData from "../data/coursesData";

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const navigate = useNavigate();

  // === Загрузка пользователя ===
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

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

  const handleExitToMain = () => navigate("/");

  // === Открытие курса ===
  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка личного кабинета...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              UO
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Личный кабинет — Югра.Нефть</h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Ваши курсы и достижения
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/profile" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
                    <span className="text-black font-semibold">
                      {(user.email?.[0] ?? "U").toUpperCase()}
                    </span>
                  </div>
                  <span className="text-yellow-500 font-medium">
                    {user.email || "Пользователь"}
                  </span>
                </Link>

                <button
                  onClick={handleExitToMain}
                  className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
                >
                  Выйти в меню
                </button>
              </>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="menu"
            >
              <Menu className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {user ? (
          <>
            <section id="courses" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                🎓 Мои курсы
              </h2>
              <CoursesSection onStartCourse={handleStartCourse} />
            </section>

            <section id="achievements">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                🏆 Мои достижения
              </h2>
              <AchievementsSection />
            </section>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto p-10 text-center border border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Доступ ограничен 🚫</h2>
            <p className="text-gray-700 mb-6">
              Чтобы получить доступ к курсам и сертификатам, войдите или зарегистрируйтесь.
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

      {/* ===== Модальное окно курса ===== */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default Cabinet;
