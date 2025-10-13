import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Star,
  Mountain,
  HardHat,
  Crown,
  Medal,
  File as Oil,
  History,
  PenTool as Tool,
  Truck,
  Leaf,
  FlaskRound as Flask,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import coursesData from "../data/coursesData";
import { Course } from "../types/course";

/* ------------------------------ HEADER ------------------------------ */

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadUserAndProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth getUser error:", error);
        return;
      }
      const currentUser = data?.user ?? null;
      if (!mounted) return;
      setUser(currentUser);

      if (currentUser) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url")
          .eq("id", currentUser.id)
          .maybeSingle();
        setProfile(profData);
      } else {
        setProfile(null);
      }
    };

    loadUserAndProfile();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) setProfile(null);
    });

    return () => {
      mounted = false;
      try {
        (sub as any)?.subscription?.unsubscribe?.();
        (sub as any)?.unsubscribe?.();
      } catch (e) {}
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
    setUser(null);
    setProfile(null);
    navigate("/");
  };

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">UO</div>
          <div>
            <h1 className="text-lg md:text-xl font-bold">Личный кабинет | Югра.Нефть</h1>
            <p className="text-xs text-gray-300 hidden md:block">Ваши курсы и достижения</p>
          </div>
        </div>

        {/* Блок справа */}
        <div className="flex items-center space-x-4">
          {user ? (
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
                <span className="text-yellow-500 hover:text-yellow-400 font-medium">
                  {profile?.first_name || user.email || "Пользователь"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition"
              >
                Войти
              </button>
              <button
                onClick={onRegister}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
              >
                Регистрация
              </button>
            </>
          )}

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="menu">
            <Menu className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

/* ------------------------------ COURSES ------------------------------ */

interface CoursesSectionProps {
  onStartCourse: (courseId: number) => void;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ onStartCourse }) => {
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleCourses(coursesData), 300);
    return () => clearTimeout(timer);
  }, []);

  const courseIcons = {
    1: <Oil className="text-yellow-400 text-6xl" />,
    2: <History className="text-yellow-400 text-6xl" />,
    3: <Mountain className="text-yellow-400 text-6xl" />,
    4: <Tool className="text-yellow-400 text-6xl" />,
    5: <Truck className="text-yellow-400 text-6xl" />,
    6: <Leaf className="text-yellow-400 text-6xl" />,
    7: <Flask className="text-yellow-400 text-6xl" />,
  };

  return (
    <section id="courses" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Мои курсы</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course, index) => (
            <div
              key={course.id}
              className={`course-card bg-white rounded-lg shadow-md overflow-hidden transition duration-500 transform ${
                visibleCourses.includes(course) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="h-48 bg-gray-800 flex items-center justify-center">{courseIcons[course.id as keyof typeof courseIcons]}</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.lessons.length} уроков</span>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition"
                    onClick={() => onStartCourse(course.id)}
                  >
                    Начать курс
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------ ACHIEVEMENTS ------------------------------ */

const iconsMap: Record<string, any> = { star: Star, mountain: Mountain, "hard-hat": HardHat, crown: Crown, medal: Medal };

const AchievementsSection: React.FC = () => {
  const [earned, setEarned] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("achievements").select("*").order("id");
      setAchievements(data || []);
    };
    load();
  }, []);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId)
      .then(({ data }) => setEarned(data?.map((a) => a.achievement_id) || []));
  }, [userId]);

  return (
    <section id="achievements" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">🏆 Мои достижения</h2>
        {!userId ? (
          <p className="text-center text-gray-500">
            🔐 Войдите в аккаунт, чтобы увидеть свои достижения.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {achievements.map(({ id, title, description, icon }) => {
              const earnedNow = earned.includes(id);
              const Icon = iconsMap[icon] || Star;
              return (
                <div
                  key={id}
                  className={`p-4 rounded-lg text-center transition transform hover:-translate-y-1 ${
                    earnedNow
                      ? "bg-yellow-100 border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 ${
                      earnedNow
                        ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)] scale-110"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

/* ------------------------------ FOOTER ------------------------------ */

const Footer: React.FC = () => (
  <footer className="bg-black text-white py-8 mt-auto">
    <div className="container mx-auto px-4 text-center">
      <p className="text-gray-400">© 2025 Югра.Нефть. Все права защищены.</p>
    </div>
  </footer>
);

/* ------------------------------ CABINET ------------------------------ */

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  const handleStartCourse = (courseId: number) => {
    console.log("Start course", courseId);
  };

  const handleLogin = () => {
    // можно подключить модалки входа
    alert("Откроется окно входа");
  };

  const handleRegister = () => {
    alert("Откроется окно регистрации");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <main className="flex-grow">
        {user ? (
          <>
            <CoursesSection onStartCourse={handleStartCourse} />
            <AchievementsSection />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4">
            <h2 className="text-2xl font-semibold mb-4 max-w-2xl">
              Для того, чтобы получить доступ к курсам и сохранению результата,
              войдите или зарегистрируйтесь на сайте.
            </h2>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Войти
              </button>
              <button
                onClick={handleRegister}
                className="px-6 py-2 border border-yellow-500 text-yellow-600 font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition"
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

