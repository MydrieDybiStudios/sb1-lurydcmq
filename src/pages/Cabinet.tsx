import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import ResultsComponent from "../components/ResultsComponent";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import coursesData from "../data/coursesData";

interface ProgressItem {
  course_id: string;
  score: number;
  total: number;
  percentage: number;
  updated_at: string;
}

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourseResult, setSelectedCourseResult] = useState<ProgressItem | null>(null);
  const navigate = useNavigate();

  // === Загрузка пользователя и прогресса ===
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (profData) setProfile(profData);

        const { data: progressData } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        setProgress(progressData || []);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleExitToMain = () => navigate("/");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка личного кабинета...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              UO
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Личный кабинет — Югра.Нефть</h1>
              <p className="text-xs text-gray-300 hidden md:block">Ваши курсы и достижения</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/profile" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-semibold">
                        {(profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-yellow-500 font-medium">
                    {profile?.first_name || user.email || "Пользователь"}
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

      {/* MAIN */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {user ? (
          <>
            <section id="courses" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🎓 Мои курсы</h2>

              {progress.length === 0 ? (
                <p className="text-center text-gray-600">Вы ещё не проходили ни один курс.</p>
              ) : (
                <div className="space-y-3">
                  {progress.map((p) => {
                    const course = coursesData.find((c) => c.id === p.course_id);
                    return (
                      <div
                        key={p.course_id}
                        className="flex justify-between bg-white p-4 border rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-semibold">{course?.title || p.course_id}</p>
                          <p className="text-sm text-gray-500">
                            Баллы: {p.score}/{p.total}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-bold text-yellow-600">{p.percentage}%</p>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-lg"
                            onClick={() => setSelectedCourseResult(p)}
                          >
                            Посмотреть результат
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section id="achievements">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🏆 Мои достижения</h2>
              <AchievementsSection />
            </section>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto p-10 text-center border border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Доступ ограничен 🚫</h2>
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

      {/* Модальное окно курса */}
      <CourseModal
        isOpen={false}
        onClose={() => {}}
        course={null}
      />

      {/* Модальное окно результата */}
      {selectedCourseResult && profile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedCourseResult(null)}
            >
              ✕
            </button>
            <ResultsComponent
              results={selectedCourseResult}
              courseName={coursesData.find(c => c.id === selectedCourseResult.course_id)?.title || selectedCourseResult.course_id}
              userName={`${profile.first_name || ""} ${profile.last_name || ""}`.trim()}
              onClose={() => setSelectedCourseResult(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cabinet;
