import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import coursesData from "../data/coursesData";
import { directions } from "../data/directionsData";
import DirectionSelector from "../components/DirectionSelector";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

interface ProfileData {
  first_name: string;
  last_name: string;
  class_num: number;
  class_range: "1-8" | "8-11";
  avatar_url: string | null;
  direction?: string | null; // добавлено поле направления
}

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"courses" | "profile" | "ar" | "vr">("courses");
  const [isDirectionModalOpen, setIsDirectionModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user ?? null);

        if (userData?.user) {
          // Загружаем профиль пользователя
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userData.user.id)
            .single();

          setProfile(profileData);
        } else {
          // Для неавторизованных проверяем localStorage
          const savedDirection = localStorage.getItem('preferredDirection');
          if (savedDirection) {
            setProfile({ direction: savedDirection } as ProfileData); // частичный профиль для направления
          }
        }
      } catch (err) {
        console.error("Ошибка получения данных:", err);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleDirectionSelect = async (directionId: string) => {
    if (user) {
      // Сохраняем в БД
      const { error } = await supabase
        .from('profiles')
        .update({ direction: directionId })
        .eq('id', user.id);
      if (error) {
        console.error('Ошибка сохранения направления:', error);
        return;
      }
      // Обновляем локальный profile
      setProfile(prev => prev ? { ...prev, direction: directionId } : { direction: directionId } as ProfileData);
    } else {
      // Для неавторизованных сохраняем в localStorage
      localStorage.setItem('preferredDirection', directionId);
      setProfile(prev => prev ? { ...prev, direction: directionId } : { direction: directionId } as ProfileData);
    }
  };

  const handleExitToMain = () => navigate("/");

  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  const handleGoToProfile = () => {
    setActiveSection("profile");
  };

  const handleNavigateToAR = () => {
    navigate("/ar-module");
  };

  const handleNavigateToVR = () => {
    navigate("/vr-module");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка личного кабинета...
      </div>
    );

  // Полное имя из профиля: first_name + last_name
  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || 
      (user?.email ? user.email.split("@")[0] : "Пользователь")
    : user?.email 
      ? user.email.split("@")[0] 
      : "Пользователь";

  // Инициалы для аватара
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    if (profile?.last_name) {
      return profile.last_name[0].toUpperCase();
    }
    return String(displayName?.[0] ?? "U").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* КРУГЛЫЙ ЛОГОТИП */}
            <img 
              src={logo} 
              alt="Югра.Нефть" 
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold">Личный кабинет — Югра.Нефть</h1>
              <p className="text-xs text-gray-300 hidden md:block">Ваши курсы и достижения</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-4">
                {/* Навигация между разделами */}
                <nav className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => setActiveSection("courses")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeSection === "courses"
                        ? "bg-yellow-500 text-black"
                        : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                    }`}
                  >
                    Курсы
                  </button>
                  <button
                    onClick={() => setActiveSection("profile")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeSection === "profile"
                        ? "bg-yellow-500 text-black"
                        : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                    }`}
                  >
                    Профиль
                  </button>
                  <button
                    onClick={handleNavigateToAR}
                    className="px-4 py-2 rounded-lg font-medium transition text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  >
                    AR-модуль
                  </button>
                  <button
                    onClick={handleNavigateToVR}
                    className="px-4 py-2 rounded-lg font-medium transition text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  >
                    VR-модуль
                  </button>
                </nav>

                {/* Кликабельные аватар и никнейм - СДВИНУТО ВПРАВО */}
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ml-auto"
                  onClick={handleGoToProfile}
                  title="Перейти в профиль"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-black font-semibold">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-yellow-500 font-medium block">
                      {displayName}
                    </span>
                    {profile?.class_num && (
                      <span className="text-gray-300 text-xs block">
                        {profile.class_num} класс
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleExitToMain}
                  className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
                >
                  Выйти в меню
                </button>
              </div>
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

        {/* Мобильная навигация */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700 px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setActiveSection("courses");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-left transition ${
                  activeSection === "courses"
                    ? "bg-yellow-500 text-black"
                    : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                Курсы
              </button>
              <button
                onClick={() => {
                  setActiveSection("profile");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-left transition ${
                  activeSection === "profile"
                    ? "bg-yellow-500 text-black"
                    : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => {
                  handleNavigateToAR();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg font-medium text-left transition text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                AR-модуль
              </button>
              <button
                onClick={() => {
                  handleNavigateToVR();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg font-medium text-left transition text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                VR-модуль
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {user ? (
          <>
            {activeSection === "courses" && (
              <>
                <section id="courses" className="mb-16">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                      🎓 Мои курсы
                      {profile?.direction && (
                        <span className="text-base font-normal text-gray-600 ml-4">
                          (направление: {directions.find(d => d.id === profile.direction)?.name || profile.direction})
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={() => setIsDirectionModalOpen(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Сменить направление
                    </button>
                  </div>
                  <CoursesSection 
                    onStartCourse={handleStartCourse} 
                    selectedDirection={profile?.direction}
                  />
                </section>

                <section id="achievements">
                  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🏆 Мои достижения</h2>
                  <AchievementsSection />
                </section>
              </>
            )}
            {activeSection === "profile" && <Profile />}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto p-10 text-center border border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Доступ ограничен 🚫</h2>
            <p className="text-gray-700 mb-6">
              Для того, чтобы получить доступ к курсам и сертификатам,
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

      <CourseModal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)} 
        course={selectedCourse} 
      />

      <DirectionSelector
        isOpen={isDirectionModalOpen}
        onClose={() => setIsDirectionModalOpen(false)}
        onSelect={handleDirectionSelect}
        currentDirection={profile?.direction || undefined}
      />
    </div>
  );
};

export default Cabinet;
