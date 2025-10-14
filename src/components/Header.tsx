import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип и название */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              UO
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">
                Цифровая Образовательная Платформа "Югра.Нефть"
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Интерактивные курсы, тесты и достижения
              </p>
            </div>
          </Link>
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/about" className="hover:text-yellow-400 transition py-2">
            О проекте
          </Link>
          <Link to="/how-it-works" className="hover:text-yellow-400 transition py-2">
            Как работает
          </Link>
          <Link to="/partners" className="hover:text-yellow-400 transition py-2">
            Партнёры
          </Link>
          {user && (
            <Link to="/cabinet" className="hover:text-yellow-400 transition py-2">
              Мои курсы
            </Link>
          )}
        </nav>

        {/* Блок справа */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Кликабельные аватар и имя пользователя */}
              <div 
                className="flex items-center gap-3 cursor-pointer group"
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
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
              >
                Личный кабинет
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

          {/* Кнопка мобильного меню */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="menu"
          >
            <Menu className="text-xl" />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={`md:hidden bg-black py-4 px-4 border-t border-gray-800 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/* Основная навигация */}
          <Link 
            to="/about" 
            className="hover:text-yellow-400 transition py-2"
            onClick={closeMobileMenu}
          >
            О проекте
          </Link>
          <Link 
            to="/how-it-works" 
            className="hover:text-yellow-400 transition py-2"
            onClick={closeMobileMenu}
          >
            Как работает
          </Link>
          <Link 
            to="/partners" 
            className="hover:text-yellow-400 transition py-2"
            onClick={closeMobileMenu}
          >
            Партнёры
          </Link>

          {/* Блок пользователя */}
          {user ? (
            <>
              {/* Профиль пользователя */}
              <div 
                className="flex items-center gap-3 cursor-pointer py-3 border-t border-gray-800 pt-4"
                onClick={() => {
                  handleProfileClick();
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black font-semibold text-sm">
                      {(profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-yellow-500 font-medium">
                    {profile?.first_name || user.email || "Пользователь"}
                  </span>
                  <span className="text-gray-400 text-sm">Профиль</span>
                </div>
              </div>

              <Link 
                to="/cabinet" 
                className="text-yellow-500 hover:text-yellow-400 transition py-2"
                onClick={closeMobileMenu}
              >
                Личный кабинет
              </Link>
              
              <button 
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="text-yellow-500 hover:text-yellow-400 transition text-left py-2"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              {/* Кнопки авторизации для неавторизованных пользователей */}
              <div className="border-t border-gray-800 pt-4 flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    onLogin();
                    closeMobileMenu();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded transition text-center"
                >
                  Войти
                </button>
                <button 
                  onClick={() => {
                    onRegister();
                    closeMobileMenu();
                  }}
                  className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-3 px-4 rounded transition text-center"
                >
                  Регистрация
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
