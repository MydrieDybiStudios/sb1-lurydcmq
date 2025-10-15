import React, { useState, useEffect } from "react";
import { Menu, X, Compass } from "lucide-react";
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

  // Функции для скролла к секциям (только для главной страницы)
  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если не на главной, переходим на главную и скроллим
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

  // Элементы быстрой навигации
  const quickNavItems = [
    { icon: Compass, label: "Главная", action: () => navigate("/") },
    { icon: Compass, label: "О проекте", action: () => scrollToSection("about") },
    { icon: Compass, label: "Как работает", action: () => scrollToSection("how-it-works") },
    { icon: Compass, label: "Партнёры", action: () => scrollToSection("partners") },
    { icon: Compass, label: "Контакты", action: () => scrollToSection("cta") },
    { icon: Compass, label: "Отзывы", action: () => navigate("/reviews") },
  ];

  // Если пользователь авторизован, добавляем ссылки на профиль
  if (user) {
    quickNavItems.push(
      { icon: Compass, label: "Личный кабинет", action: () => navigate("/cabinet") },
      { icon: Compass, label: "Мой профиль", action: () => navigate("/profile") }
    );
  }

  return (
    <header className="bg-black text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип и название - КРУГЛЫЙ ЛОГОТИП */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src={logo} 
              alt="Югра.Нефть" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 object-cover border-2 border-yellow-400"
            />
            <div className="max-w-[180px] sm:max-w-none">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold leading-tight">
                <span className="hidden sm:inline">Цифровая Образовательная Платформа </span>
                <span className="sm:hidden">Платформа </span>
                "Югра.Нефть"
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Интерактивные курсы, тесты и достижения
              </p>
            </div>
          </Link>
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden lg:flex items-center space-x-6 mr-8">
          <button 
            onClick={() => scrollToSection('about')}
            className="hover:text-yellow-400 transition py-2 whitespace-nowrap"
          >
            О проекте
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-yellow-400 transition py-2 whitespace-nowrap"
          >
            Как работает
          </button>
          <button 
            onClick={() => scrollToSection('partners')}
            className="hover:text-yellow-400 transition py-2 whitespace-nowrap"
          >
            Партнёры
          </button>
          <Link to="/reviews" className="hover:text-yellow-400 transition py-2 whitespace-nowrap">
            Отзывы
          </Link>
          {user && (
            <Link to="/cabinet" className="hover:text-yellow-400 transition py-2 whitespace-nowrap">
              Мои курсы
            </Link>
          )}
        </nav>

        {/* Блок справа - СДВИНУТ ВПРАВО с улучшенным отступом */}
        <div className="flex items-center space-x-4 ml-8">
          {user ? (
            <>
              {/* Кликабельные аватар и имя пользователя - СДВИНУТО ВПРАВО */}
              <div 
                className="flex items-center gap-3 cursor-pointer group ml-auto"
                onClick={handleProfileClick}
                title="Перейти в профиль"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400 group-hover:border-yellow-300 transition-colors">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black font-semibold">
                      {(profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-yellow-500 hover:text-yellow-400 font-medium hidden sm:block group-hover:text-yellow-300 transition-colors">
                  {profile?.first_name || user.email || "Пользователь"}
                </span>
              </div>

              <Link
                to="/cabinet"
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition whitespace-nowrap"
              >
                Личный кабинет
              </Link>

              <button
                onClick={handleLogout}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition whitespace-nowrap"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition whitespace-nowrap"
              >
                Войти
              </button>
              <button
                onClick={onRegister}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition whitespace-nowrap"
              >
                Регистрация
              </button>
            </>
          )}

          {/* Кнопка быстрой навигации для ПК */}
          <button
            onClick={() => setIsQuickNavOpen(true)}
            className="hidden lg:flex items-center justify-center w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full transition-all duration-300 hover:scale-110 ml-2"
            aria-label="Быстрая навигация"
          >
            <Compass className="w-6 h-6" />
          </button>

          {/* Кнопка мобильного меню - УБРАНА ИЗ ВИДИМОСТИ НА МОБИЛЬНЫХ */}
          <button
            className="lg:hidden opacity-0 pointer-events-none w-0"
            aria-hidden="true"
          >
            <Menu className="text-xl" />
          </button>
        </div>
      </div>

      {/* Горизонтальная навигация для планшетов */}
      <nav className="lg:hidden bg-gray-900 border-t border-gray-800 overflow-x-auto">
        <div className="flex space-x-6 px-4 py-2 whitespace-nowrap">
          <button 
            onClick={() => scrollToSection('about')}
            className="hover:text-yellow-400 transition py-2 text-sm"
          >
            О проекте
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-yellow-400 transition py-2 text-sm"
          >
            Как работает
          </button>
          <button 
            onClick={() => scrollToSection('partners')}
            className="hover:text-yellow-400 transition py-2 text-sm"
          >
            Партнёры
          </button>
          <Link to="/reviews" className="hover:text-yellow-400 transition py-2 text-sm">
            Отзывы
          </Link>
          {user && (
            <Link to="/cabinet" className="hover:text-yellow-400 transition py-2 text-sm">
              Мои курсы
            </Link>
          )}
        </div>
      </nav>

      {/* Модальное окно быстрой навигации для ПК */}
      {isQuickNavOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Быстрая навигация</h3>
              <button 
                onClick={closeQuickNav}
                className="text-gray-500 hover:text-gray-700 transition"
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
                    onClick={item.action}
                    className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-all duration-300 hover:scale-105"
                  >
                    <IconComponent className="w-8 h-8 text-yellow-600 mb-3" />
                    <span className="text-base font-medium text-gray-700 text-center">{item.label}</span>
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
