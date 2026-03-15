import React, { useState, useEffect } from "react";
import { Menu, X, Compass, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Блокировка прокрутки body при открытом модальном окне
  useEffect(() => {
    if (isMobileMenuOpen || isQuickNavOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Снимаем блокировку при размонтировании компонента
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen, isQuickNavOpen]);

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
        const { data: profData, error: profError } = await supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profError && profError.code !== "PGRST116") {
          console.error("Ошибка загрузки профиля:", profError);
        } else if (profData) {
          setProfile(profData);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };

    loadUserAndProfile();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) setProfile(null);
      else {
        supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url")
          .eq("id", u.id)
          .maybeSingle()
          .then(({ data: profData, error: profError }) => {
            if (!profError && profData) setProfile(profData);
          });
      }
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

  const handleProfileClick = () => {
    navigate("/cabinet");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeQuickNav = () => {
    setIsQuickNavOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    closeMobileMenu();
    closeQuickNav();
  };

  const baseQuickNavItems = [
    { icon: Compass, label: "Главная", action: () => navigate("/") },
    { icon: Compass, label: "О проекте", action: () => scrollToSection("about") },
    { icon: Compass, label: "Как работает", action: () => scrollToSection("how-it-works") },
    { icon: Compass, label: "Партнёры", action: () => scrollToSection("partners") },
    { icon: Compass, label: "Контакты", action: () => scrollToSection("cta") },
    { icon: Compass, label: "Отзывы", action: () => navigate("/reviews") },
    { icon: Compass, label: "Вузы и ЕГЭ", action: () => navigate("/universities") },
    { icon: Compass, label: "Тест профессии", action: () => navigate("/career-test") },
  ];

  const userQuickNavItems = user ? [
    { icon: Compass, label: "Симуляторы", action: () => navigate("/simulators") },
    { icon: Compass, label: "AR-модуль", action: () => navigate("/ar-module") },
    { icon: Compass, label: "VR-модуль", action: () => navigate("/vr-module") },
    { icon: Compass, label: "Личный кабинет", action: () => navigate("/cabinet") },
    { icon: Compass, label: "Мой профиль", action: () => navigate("/profile") }
  ] : [];

  const quickNavItems = [...baseQuickNavItems, ...userQuickNavItems];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип и название */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <img 
                src={logo} 
                alt="Югра.Нефть" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight tracking-tight">
                <span className="hidden sm:inline">Цифровая Образовательная Платформа </span>
                <span className="sm:hidden">ЦОП </span>
                <span className="text-yellow-400">«Югра.Нефть»</span>
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Интерактивные курсы, тесты и достижения
              </p>
            </div>
          </Link>
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden lg:flex items-center space-x-1">
          {[
            { label: "О проекте", action: () => scrollToSection('about') },
            { label: "Как работает", action: () => scrollToSection('how-it-works') },
            { label: "Партнёры", action: () => scrollToSection('partners') },
            { label: "Отзывы", action: () => navigate("/reviews") },
            { label: "Вузы и ЕГЭ", action: () => navigate("/universities") },
            { label: "Тест профессии", action: () => navigate("/career-test") },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-yellow-400 transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => navigate("/cabinet")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-yellow-400 transition-all duration-200"
            >
              Мои курсы
            </button>
          )}
        </nav>

        {/* Блок справа */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <>
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={handleProfileClick}
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
                      {(profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-yellow-400 font-medium hidden sm:block group-hover:text-yellow-300 transition-colors">
                  {profile?.first_name || user.email?.split('@')[0] || "Пользователь"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center space-x-1 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
              >
                Войти
              </button>
              <button
                onClick={onRegister}
                className="hidden sm:inline-block border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Регистрация
              </button>
            </>
          )}

          {/* Кнопка быстрой навигации для ПК */}
          <button
            onClick={() => setIsQuickNavOpen(true)}
            className="hidden lg:flex items-center justify-center w-10 h-10 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg"
            aria-label="Быстрая навигация"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Кнопка мобильного меню */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню с затемнённым фоном */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Затемнение фона */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Панель меню */}
          <div className="absolute top-0 left-0 w-full bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl animate-slideDown">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <nav className="flex flex-col space-y-3">
                {[
                  { label: "О проекте", action: () => scrollToSection('about') },
                  { label: "Как работает", action: () => scrollToSection('how-it-works') },
                  { label: "Партнёры", action: () => scrollToSection('partners') },
                  { label: "Отзывы", action: () => navigate("/reviews") },
                  { label: "Вузы и ЕГЭ", action: () => navigate("/universities") },
                  { label: "Тест профессии", action: () => navigate("/career-test") },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { item.action(); closeMobileMenu(); }}
                    className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                  >
                    {item.label}
                  </button>
                ))}
                {user && (
                  <>
                    <button
                      onClick={() => { navigate("/cabinet"); closeMobileMenu(); }}
                      className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                    >
                      Мои курсы
                    </button>
                    <button
                      onClick={() => { navigate("/ar-module"); closeMobileMenu(); }}
                      className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                    >
                      AR-модуль
                    </button>
                    <button
                      onClick={() => { navigate("/vr-module"); closeMobileMenu(); }}
                      className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                    >
                      VR-модуль
                    </button>
                     <button
                      onClick={() => { navigate("/simulators"); closeMobileMenu(); }}
                      className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                    >
                      Симуляторы
                    </button>
                    <button
                      onClick={() => { navigate("/profile"); closeMobileMenu(); }}
                      className="text-left px-4 py-3 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-200 text-lg"
                    >
                      Мой профиль
                    </button>
                  </>
                )}
                {!user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => { onLogin(); closeMobileMenu(); }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded-lg transition text-lg"
                    >
                      Войти
                    </button>
                    <button
                      onClick={() => { onRegister(); closeMobileMenu(); }}
                      className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-3 px-4 rounded-lg transition text-lg"
                    >
                      Регистрация
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className="w-full flex items-center justify-center space-x-2 border border-red-500 hover:bg-red-500 hover:text-white text-red-400 font-medium py-3 px-4 rounded-lg transition text-lg"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Горизонтальная навигация для планшетов (оставляем для удобства) */}
      <nav className="lg:hidden bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 overflow-x-auto">
        <div className="flex space-x-4 px-4 py-2 whitespace-nowrap">
          <button onClick={() => scrollToSection('about')} className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            О проекте
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            Как работает
          </button>
          <button onClick={() => scrollToSection('partners')} className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            Партнёры
          </button>
          <Link to="/reviews" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            Отзывы
          </Link>
          <Link to="/universities" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            Вузы и ЕГЭ
          </Link>
          <Link to="/career-test" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
            Тест профессии
          </Link>
          {user && (
            <>
              <Link to="/cabinet" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
                Мои курсы
              </Link>
              <Link to="/ar-module" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
                AR-модуль
              </Link>
              <Link to="/vr-module" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
                VR-модуль
              </Link>
              <Link to="/simulators" className="hover:text-yellow-400 transition py-2 text-sm font-medium">
                Симуляторы
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Модальное окно быстрой навигации для ПК (расположено ниже, скролл заблокирован) */}
      {isQuickNavOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32"
          onClick={closeQuickNav}
        >
          {/* Затемнение фона */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Панель меню */}
          <div 
            className="relative bg-gray-900 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-yellow-400">Быстрая навигация</h3>
              <button 
                onClick={closeQuickNav}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickNavItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => { item.action(); closeQuickNav(); }}
                    className="flex flex-col items-center p-6 bg-gray-800 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-300 border border-gray-700 hover:border-yellow-400 group"
                  >
                    <IconComponent className="w-8 h-8 text-yellow-400 group-hover:text-black mb-3" />
                    <span className="text-sm font-medium text-white group-hover:text-black text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
