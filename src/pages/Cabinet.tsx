// src/pages/Cabinet.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronRight, Award, BookOpen, User, Compass,
  LogOut, Map, Book, FileText, Library, Calendar, Settings,
  MoreHorizontal, ChevronDown, Trophy
} from "lucide-react";
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

// ========== Вспомогательные компоненты для навигации ==========
interface NavButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  hideLabel?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, active, icon, label, hideLabel = false }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1
      ${active
        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
        : 'text-yellow-400 hover:bg-yellow-500 hover:text-black'
      }
    `}
    title={hideLabel ? label : undefined}
  >
    {icon}
    {!hideLabel && <span>{label}</span>}
  </button>
);

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  align?: "left" | "right";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  isOpen,
  onClose,
  align = "right"
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={ref}>
      {trigger}
      <div
        className={`
          absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-56
          bg-gray-800 rounded-lg shadow-xl border border-gray-700 
          overflow-hidden z-50 transform transition-all duration-200 origin-top-right
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

interface MobileMenuProps {
  activeSection: "courses" | "profile" | "ar" | "vr";
  setActiveSection: (section: "courses" | "profile" | "ar" | "vr") => void;
  onClose: () => void;
  onNavigateToAR: () => void;
  onNavigateToVR: () => void;
  onNavigateToSim: () => void;
  onNavigateToMap: () => void;
  onNavigateToGlossary: () => void;
  onNavigateToArticles: () => void;
  onNavigateToBooks: () => void;
  onNavigateToAdminEvents: () => void;
  onNavigateToAdminCourses: () => void;
  onNavigateToAdminOlympiads: () => void;
  onExitToMain: () => void;
  onLogout: () => void;
  isAdmin: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  activeSection,
  setActiveSection,
  onClose,
  onNavigateToAR,
  onNavigateToVR,
  onNavigateToSim,
  onNavigateToMap,
  onNavigateToGlossary,
  onNavigateToArticles,
  onNavigateToBooks,
  onNavigateToAdminEvents,
  onNavigateToAdminCourses,
  onNavigateToAdminOlympiads,
  onExitToMain,
  onLogout,
  isAdmin
}) => {
  return (
    <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 shadow-2xl animate-slideDown z-50">
      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => { setActiveSection("courses"); onClose(); }}
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
          onClick={() => { setActiveSection("profile"); onClose(); }}
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
          onClick={() => { onNavigateToAR(); onClose(); }}
          className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
        >
          <Compass className="w-5 h-5 mr-3" />
          AR-модуль
        </button>
        <button
          onClick={() => { onNavigateToVR(); onClose(); }}
          className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
        >
          <Compass className="w-5 h-5 mr-3" />
          VR-модуль
        </button>
        <button
          onClick={() => { onNavigateToSim(); onClose(); }}
          className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
        >
          <Compass className="w-5 h-5 mr-3" />
          Симуляторы
        </button>
        <button
          onClick={() => { onNavigateToMap(); onClose(); }}
          className="px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
        >
          <Map className="w-5 h-5 mr-3" />
          Карта месторождений
        </button>

        {/* Библиотека в мобильном меню */}
        <div className="border-t border-gray-800 pt-2 mt-2">
          <div className="px-4 py-2 text-yellow-400 font-bold flex items-center">
            <Library className="w-5 h-5 mr-3" />
            Библиотека
          </div>
          <button
            onClick={() => { onNavigateToGlossary(); onClose(); }}
            className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            <BookOpen className="w-4 h-4 mr-3" />
            Словарь терминов
          </button>
          <button
            onClick={() => { onNavigateToArticles(); onClose(); }}
            className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            <FileText className="w-4 h-4 mr-3" />
            Технические статьи
          </button>
          <button
            onClick={() => { onNavigateToBooks(); onClose(); }}
            className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            <Book className="w-4 h-4 mr-3" />
            Книги и методички
          </button>
        </div>

        {isAdmin && (
          <div className="border-t border-gray-800 pt-2 mt-2">
            <div className="px-4 py-2 text-yellow-400 font-bold flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              Управление
            </div>
            <button
              onClick={() => { onNavigateToAdminEvents(); onClose(); }}
              className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              <Calendar className="w-4 h-4 mr-3" />
              Мероприятия
            </button>
            <button
              onClick={() => { onNavigateToAdminCourses(); onClose(); }}
              className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              <BookOpen className="w-4 h-4 mr-3" />
              Курсы
            </button>
            <button
              onClick={() => { onNavigateToAdminOlympiads(); onClose(); }}
              className="w-full px-8 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              <Trophy className="w-4 h-4 mr-3" />
              Олимпиады
            </button>
          </div>
        )}

        <div className="border-t border-gray-800 pt-2 mt-2">
          <button
            onClick={() => { onExitToMain(); onClose(); }}
            className="w-full px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            На главную
          </button>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full px-4 py-3 rounded-lg font-medium text-left transition flex items-center text-red-400 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Выйти
          </button>
        </div>
      </nav>
    </div>
  );
};

// ========== Основной компонент Cabinet ==========
const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"courses" | "profile" | "ar" | "vr">("courses");
  const [isDirectionModalOpen, setIsDirectionModalOpen] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [upcomingOlympiads, setUpcomingOlympiads] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Мемоизированные обработчики
  const handleNavigateToAR = useCallback(() => navigate("/ar-module"), [navigate]);
  const handleNavigateToVR = useCallback(() => navigate("/vr-module"), [navigate]);
  const handleNavigateToSim = useCallback(() => navigate("/simulators"), [navigate]);
  const handleNavigateToMap = useCallback(() => navigate("/map"), [navigate]);
  const handleNavigateToGlossary = useCallback(() => navigate("/glossary"), [navigate]);
  const handleNavigateToArticles = useCallback(() => navigate("/articles"), [navigate]);
  const handleNavigateToBooks = useCallback(() => navigate("/books"), [navigate]);
  const handleExitToMain = useCallback(() => navigate("/"), [navigate]);
  const handleGoToProfile = useCallback(() => setActiveSection("profile"), []);
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  // Функция загрузки предстоящих мероприятий
  const fetchUpcomingEvents = useCallback(async () => {
    if (!user) {
      setUpcomingEvents([]);
      return;
    }
    const { data: regs } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", user.id);
    if (!regs?.length) {
      setUpcomingEvents([]);
      return;
    }
    const eventIds = regs.map(r => r.event_id);
    const now = new Date().toISOString();
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds)
      .gt("start_time", now)
      .order("start_time", { ascending: true })
      .limit(3);
    setUpcomingEvents(events || []);
  }, [user]);

  // Функция загрузки олимпиад, на которые зарегистрирован пользователь
  const fetchUpcomingOlympiads = useCallback(async () => {
    if (!user) {
      setUpcomingOlympiads([]);
      return;
    }
    const { data: regs } = await supabase
      .from("olympiad_registrations")
      .select("olympiad_id, status, final_score, place, diploma_url")
      .eq("user_id", user.id);
    if (!regs?.length) {
      setUpcomingOlympiads([]);
      return;
    }
    const olympiadIds = regs.map(r => r.olympiad_id);
    const { data: olympiads } = await supabase
      .from("olympiads")
      .select("*")
      .in("id", olympiadIds)
      .order("created_at", { ascending: false });
    if (olympiads) {
      const enriched = olympiads.map(olympiad => {
        const reg = regs.find(r => r.olympiad_id === olympiad.id);
        return { ...olympiad, registration: reg };
      });
      setUpcomingOlympiads(enriched);
    }
  }, [user]);

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
          const { data: adminCheck } = await supabase.rpc("is_admin");
          setIsAdmin(!!adminCheck);
        } else {
          const savedDirection = localStorage.getItem("preferredDirection");
          if (savedDirection) setProfile({ direction: savedDirection } as ProfileData);
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
        const { data: adminCheck } = await supabase.rpc("is_admin");
        setIsAdmin(!!adminCheck);
      } else {
        setProfile(null);
        setUpcomingEvents([]);
        setUpcomingOlympiads([]);
        setIsAdmin(false);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchUpcomingOlympiads();
  }, [user, fetchUpcomingEvents, fetchUpcomingOlympiads]);

  const handleDirectionSelect = async (directionId: string) => {
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ direction: directionId })
        .eq("id", user.id);
      if (!error) setProfile(prev => prev ? { ...prev, direction: directionId } : { direction: directionId } as ProfileData);
    } else {
      localStorage.setItem("preferredDirection", directionId);
      setProfile(prev => prev ? { ...prev, direction: directionId } : { direction: directionId } as ProfileData);
    }
  };

  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
    if (profile?.first_name) return profile.first_name[0].toUpperCase();
    if (profile?.last_name) return profile.last_name[0].toUpperCase();
    return String(displayName?.[0] ?? "U").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-black text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={handleExitToMain}>
            <div className="relative">
              <img
                src={logo}
                alt="Югра.Нефть"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-yellow-400 shadow-lg transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold">
                <span className="hidden xs:inline">Личный кабинет</span>
                <span className="xs:hidden">ЛК</span>
                <span className="text-yellow-400 ml-1">«Югра.Нефть»</span>
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-2">
              <nav className="hidden xl:flex items-center space-x-1">
                <NavButton
                  onClick={() => setActiveSection("courses")}
                  active={activeSection === "courses"}
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Курсы"
                />
                <NavButton
                  onClick={() => setActiveSection("profile")}
                  active={activeSection === "profile"}
                  icon={<User className="w-4 h-4" />}
                  label="Профиль"
                />
                <DropdownMenu
                  trigger={
                    <button
                      onClick={() => setIsLibraryMenuOpen(!isLibraryMenuOpen)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                    >
                      <Library className="w-4 h-4" />
                      <span>Библиотека</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isLibraryMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                  }
                  isOpen={isLibraryMenuOpen}
                  onClose={() => setIsLibraryMenuOpen(false)}
                  align="left"
                >
                  <button onClick={() => { handleNavigateToGlossary(); setIsLibraryMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <BookOpen className="w-4 h-4 text-yellow-400" /> Словарь терминов
                  </button>
                  <button onClick={() => { handleNavigateToArticles(); setIsLibraryMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <FileText className="w-4 h-4 text-yellow-400" /> Технические статьи
                  </button>
                  <button onClick={() => { handleNavigateToBooks(); setIsLibraryMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <Book className="w-4 h-4 text-yellow-400" /> Книги и методички
                  </button>
                </DropdownMenu>
                <DropdownMenu
                  trigger={
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      <span>Ещё</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isMoreMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                  }
                  isOpen={isMoreMenuOpen}
                  onClose={() => setIsMoreMenuOpen(false)}
                  align="left"
                >
                  <button onClick={() => { handleNavigateToAR(); setIsMoreMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <Compass className="w-4 h-4 text-yellow-400" /> AR-модуль
                  </button>
                  <button onClick={() => { handleNavigateToVR(); setIsMoreMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <Compass className="w-4 h-4 text-yellow-400" /> VR-модуль
                  </button>
                  <button onClick={() => { handleNavigateToSim(); setIsMoreMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <Compass className="w-4 h-4 text-yellow-400" /> Симуляторы
                  </button>
                  <button onClick={() => { handleNavigateToMap(); setIsMoreMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white">
                    <Map className="w-4 h-4 text-yellow-400" /> Карта
                  </button>
                </DropdownMenu>
                {isAdmin && (
                  <DropdownMenu
                    trigger={
                      <button
                        onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500 hover:text-black transition border border-yellow-500/30"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Управление</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isAdminMenuOpen ? "rotate-180" : ""}`} />
                      </button>
                    }
                    isOpen={isAdminMenuOpen}
                    onClose={() => setIsAdminMenuOpen(false)}
                    align="left"
                  >
                    <button
                      onClick={() => { navigate("/admin/events"); setIsAdminMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white"
                    >
                      <Calendar className="w-4 h-4 text-yellow-400" /> Мероприятия
                    </button>
                    <button
                      onClick={() => { navigate("/admin/courses"); setIsAdminMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white"
                    >
                      <BookOpen className="w-4 h-4 text-yellow-400" /> Курсы
                    </button>
                    <button
                      onClick={() => { navigate("/admin/olympiads"); setIsAdminMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 text-sm text-white"
                    >
                      <Trophy className="w-4 h-4 text-yellow-400" /> Олимпиады
                    </button>
                  </DropdownMenu>
                )}
              </nav>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <div
                  className="flex items-center gap-1 sm:gap-2 cursor-pointer group bg-gray-900/50 rounded-full pl-1 pr-2 sm:pl-2 sm:pr-3 py-1 hover:bg-gray-800 transition"
                  onClick={handleGoToProfile}
                  title="Профиль"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 overflow-hidden flex items-center justify-center border-2 border-yellow-400 shadow-lg">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-bold text-sm">{getInitials()}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-yellow-400 text-sm font-medium max-w-[100px] truncate">
                    {displayName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition hidden sm:inline-flex"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                <button
                  onClick={handleExitToMain}
                  className="hidden xl:inline-flex px-3 py-1.5 border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 text-sm font-medium rounded-lg transition"
                >
                  На главную
                </button>

                <button
                  className="xl:hidden p-2 rounded-lg hover:bg-white/10 transition"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {isMobileMenuOpen && user && (
          <MobileMenu
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onClose={() => setIsMobileMenuOpen(false)}
            onNavigateToAR={handleNavigateToAR}
            onNavigateToVR={handleNavigateToVR}
            onNavigateToSim={handleNavigateToSim}
            onNavigateToMap={handleNavigateToMap}
            onNavigateToGlossary={handleNavigateToGlossary}
            onNavigateToArticles={handleNavigateToArticles}
            onNavigateToBooks={handleNavigateToBooks}
            onNavigateToAdminEvents={() => navigate("/admin/events")}
            onNavigateToAdminCourses={() => navigate("/admin/courses")}
            onNavigateToAdminOlympiads={() => navigate("/admin/olympiads")}
            onExitToMain={handleExitToMain}
            onLogout={handleLogout}
            isAdmin={isAdmin}
          />
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <div className="absolute top-20 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

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
                          Направление:{" "}
                          <span className="font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            {directions.find(d => d.id === profile.direction)?.name || profile.direction}
                          </span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsDirectionModalOpen(true)}
                      className="mt-3 sm:mt-0 bg-black hover:bg-gray-900 text-yellow-400 px-5 py-2 rounded-lg font-medium transition flex items-center group"
                    >
                      Сменить направление
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                  <CoursesSection onStartCourse={handleStartCourse} selectedDirection={profile?.direction} />
                </section>

                <section id="achievements" className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-yellow-500" />
                    Мои достижения
                  </h2>
                  <AchievementsSection />
                </section>

                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                      <Calendar className="w-8 h-8 mr-3 text-yellow-500" />
                      Мои мероприятия
                    </h2>
                  </div>
                  {upcomingEvents.length === 0 ? (
                    <div className="bg-gray-100 rounded-xl p-8 text-center">
                      <p className="text-gray-500">У вас пока нет запланированных мероприятий</p>
                      <button
                        onClick={() => navigate("/events")}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition"
                      >
                        Перейти к афише
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingEvents.map(event => (
                          <div
                            key={event.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition cursor-pointer"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                  {new Date(event.start_time).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(event.start_time).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                              {event.speaker_name && <p className="text-sm text-gray-600 mb-3">{event.speaker_name}</p>}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {event.format === "online" ? "🌐 Онлайн" : "📍 Офлайн"}
                                </span>
                                <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">Подробнее →</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-6">
                        <button
                          onClick={() => navigate("/events")}
                          className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          Все мероприятия
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </section>

                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                      <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
                      Мои олимпиады
                    </h2>
                  </div>
                  {upcomingOlympiads.length === 0 ? (
                    <div className="bg-gray-100 rounded-xl p-8 text-center">
                      <p className="text-gray-500">Вы ещё не участвуете в олимпиадах</p>
                      <button
                        onClick={() => navigate("/olympiads")}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition"
                      >
                        Перейти к олимпиадам
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingOlympiads.map(item => {
                          const olympiad = item;
                          const reg = item.registration;
                          const statusText = reg?.status === 'completed' ? 'Завершена' : 'Участвую';
                          const statusColor = reg?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                          return (
                            <div
                              key={olympiad.id}
                              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition cursor-pointer"
                              onClick={() => navigate(`/olympiads/${olympiad.id}`)}
                            >
                              {olympiad.cover_image_url && (
                                <div className="h-32 overflow-hidden">
                                  <img src={olympiad.cover_image_url} alt={olympiad.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{olympiad.title}</h3>
                                {reg?.place && (
                                  <p className="text-sm text-gray-600 mb-2">Место: {reg.place}</p>
                                )}
                                {reg?.final_score && (
                                  <p className="text-sm text-gray-600 mb-2">Баллы: {reg.final_score}</p>
                                )}
                                {reg?.diploma_url && (
                                  <a
                                    href={reg.diploma_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-600 hover:text-yellow-700 text-sm font-medium block mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Скачать диплом
                                  </a>
                                )}
                                <div className="flex justify-end mt-3">
                                  <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                                    Подробнее →
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-center mt-6">
                        <button
                          onClick={() => navigate("/olympiads")}
                          className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          Все олимпиады
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
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
              <img src={logo} alt="Югра.Нефть" className="w-20 h-20 rounded-full border-4 border-white shadow-xl mx-auto mb-4" />
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

      <CourseModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} course={selectedCourse} />
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
