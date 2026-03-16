import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, Award, BookOpen, User, Compass, LogOut, Sparkles } from "lucide-react";
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
  direction?: string | null;
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
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userData.user.id)
            .single();

          setProfile(profileData);
        } else {
          const savedDirection = localStorage.getItem('preferredDirection');
          if (savedDirection) {
            setProfile({ direction: savedDirection } as ProfileData);
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
      const { error } = await supabase
        .from('profiles')
        .update({ direction: directionId })
        .eq('id', user.id);
      if (error) {
        console.error('Ошибка сохранения направления:', error);
        return;
      }
      setProfile(prev => prev ? { ...prev, direction: directionId } : { direction: directionId } as ProfileData);
    } else {
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

  const handleNavigateToSim = () => {
    navigate("/simulators");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/80 font-medium">Загружаем ваш личный кабинет...</p>
        </div>
      </div>
    );
  }

  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || 
      (user?.email ? user.email.split("@")[0] : "Пользователь")
    : user?.email 
      ? user.email.split("@")[0] 
      : "Пользователь";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Header (оставляем как есть, он уже в стиле) */}
      <header className="bg-black text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-yellow-500/20">
        {/* без изменений, оставляем оригинальный код header */}
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <img 
                src={logo} 
                alt="Югра.Нефть" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight tracking-tight">
                <span className="hidden sm:inline">Личный кабинет</span>
                <span className="sm:hidden">ЛК</span>
                <span className="text-yellow-400 ml-1">«Югра.Нефть»</span>
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">Ваши курсы, достижения и прогресс</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav className="hidden md:flex items-center space-x-1 bg-gray-900/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveSection("courses")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === "courses"
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
                      : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Курсы
                </button>
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === "profile"
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
                      : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Профиль
                </button>
                <button
                  onClick={handleNavigateToAR}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  <Compass className="w-4 h-4 inline mr-1" />
                  AR
                </button>
                <button
                  onClick={handleNavigateToVR}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  <Compass className="w-4 h-4 inline mr-1" />
                  VR
                </button>
                <button
                  onClick={handleNavigateToSim}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  <Compass className="w-4 h-4 inline mr-1" />
                  Симуляторы
                </button>
              </nav>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div 
                  className="flex items-center gap-2 cursor-pointer group bg-gray-900/50 rounded-full pl-2 pr-3 py-1 hover:bg-gray-800 transition-all duration-300"
                  onClick={handleGoToProfile}
                  title="Перейти в профиль"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 overflow-hidden flex items-center justify-center border-2 border-yellow-400 shadow-lg group-hover:shadow-yellow-400/50 transition-all duration-300">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-black font-bold text-lg">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
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
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center space-x-1 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выйти</span>
                </button>

                <button
                  onClick={handleExitToMain}
                  className="hidden lg:inline-flex border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  На главную
                </button>
              </div>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden bg-black border-t border-gray-800 px-4 py-3 animate-slideDown">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => { setActiveSection("courses"); setIsMobileMenuOpen(false); }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition flex items-center ${
                  activeSection === "courses"
                    ? "bg-yellow-500 text-black"
                    : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Курсы
              </button>
              <button
                onClick={() => { setActiveSection("profile"); setIsMobileMenuOpen(false); }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition flex items-center ${
                  activeSection === "profile"
                    ? "bg-yellow-500 text-black"
                    : "text-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Профиль
              </button>
              <button
                onClick={() => { handleNavigateToAR(); setIsMobileMenuOpen(false); }}
                className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                <Compass className="w-5 h-5 mr-3" />
                AR-модуль
              </button>
              <button
                onClick={() => { handleNavigateToVR(); setIsMobileMenuOpen(false); }}
                className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                <Compass className="w-5 h-5 mr-3" />
                VR-модуль
              </button>
              <button
                onClick={() => { handleNavigateToSim(); setIsMobileMenuOpen(false); }}
                className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                <Compass className="w-5 h-5 mr-3" />
                Симуляторы
              </button>
              <div className="border-t border-gray-800 pt-2 mt-2">
                <button
                  onClick={() => { handleExitToMain(); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  На главную
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Выйти
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Основной контент */}
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {/* Декоративные элементы в стиле hero (чёрные размытые круги) */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>

        {user ? (
          <div className="relative z-10">
            {activeSection === "courses" && (
              <>
                <section id="courses" className="mb-16">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-black mb-2 flex items-center">
                        <BookOpen className="w-8 h-8 mr-3 text-black" />
                        Мои курсы
                      </h2>
                      {profile?.direction && (
                        <p className="text-black/80 ml-11">
                          Направление: <span className="font-bold text-yellow-700 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-600/30">
                            {directions.find(d => d.id === profile.direction)?.name || profile.direction}
                          </span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsDirectionModalOpen(true)}
                      className="mt-3 sm:mt-0 bg-black text-yellow-400 hover:bg-gray-900 font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border-2 border-black"
                    >
                      <span>Сменить направление</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                  <CoursesSection 
                    onStartCourse={handleStartCourse} 
                    selectedDirection={profile?.direction}
                  />
                </section>

                <section id="achievements" className="relative">
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-8 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-black" />
                    Мои достижения
                  </h2>
                  <AchievementsSection />
                </section>
              </>
            )}

            {activeSection === "profile" && (
              <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-black mb-8 flex items-center">
                  <User className="w-8 h-8 mr-3 text-black" />
                  Профиль пользователя
                </h2>
                <Profile />
              </section>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto relative z-10">
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/30 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-2xl mb-6 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Доступ ограничен</h2>
                <p className="text-gray-300 mb-6">
                  Для доступа к курсам, достижениям и личному кабинету необходимо войти или зарегистрироваться.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/")}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition transform hover:scale-105 hover:shadow-2xl border-2 border-yellow-400"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-black text-yellow-400 hover:bg-gray-900 font-bold py-3 px-6 rounded-full transition transform hover:scale-105 hover:shadow-2xl border-2 border-black"
                  >
                    Регистрация
                  </button>
                </div>
              </div>
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
