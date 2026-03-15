import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, Award, BookOpen, User, Compass, LogOut } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Загружаем ваш личный кабинет...</p>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header с улучшенным дизайном */}
      <header className="bg-black text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Логотип и название */}
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
              {/* Десктопная навигация */}
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

              {/* Профиль и выход */}
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

              {/* Мобильная кнопка меню */}
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
        {/* Декоративные элементы */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        {user ? (
          <div className="relative z-10">
            {activeSection === "courses" && (
              <>
                <section id="courses" className="mb-16">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center">
                        <BookOpen className="w-8 h-8 mr-3 text-yellow-500" />
                        Мои курсы
                      </h2>
                      {profile?.direction && (
                        <p className="text-gray-600 ml-11">
                          Направление: <span className="font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            {directions.find(d => d.id === profile.direction)?.name || profile.direction}
                          </span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsDirectionModalOpen(true)}
                      className="mt-3 sm:mt-0 bg-black hover:bg-gray-900 text-yellow-400 px-5 py-2 rounded-lg font-medium transition-all duration-200 flex items-center group"
                    >
                      Сменить направление
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <CoursesSection 
                    onStartCourse={handleStartCourse} 
                    selectedDirection={profile?.direction}
                  />
                </section>

                <section id="achievements" className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-yellow-500" />
                    Мои достижения
                  </h2>
                  <AchievementsSection />
                </section>
              </>
            )}

            {activeSection === "profile" && (
              <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
                  <User className="w-8 h-8 mr-3 text-yellow-500" />
                  Профиль пользователя
                </h2>
                <Profile />
              </section>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-center">
              <img 
                src={logo} 
                alt="Югра.Нефть" 
                className="w-20 h-20 rounded-full border-4 border-white shadow-xl mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-black">Доступ ограничен</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                Для доступа к курсам, достижениям и личному кабинету необходимо войти или зарегистрироваться.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-black hover:bg-gray-900 text-yellow-400 font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Войти
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="border-2 border-black hover:bg-black hover:text-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Регистрация
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Модальные окна */}
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
