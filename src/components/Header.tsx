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

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
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
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden md:flex space-x-6">
          <a href="#courses" className="hover:text-yellow-400 transition">
            Курсы
          </a>
          <a href="#about" className="hover:text-yellow-400 transition">
            О платформе
          </a>
          <a href="#achievements" className="hover:text-yellow-400 transition">
            Достижения
          </a>
        </nav>

        {/* Блок справа */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
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
                <span className="text-yellow-500 hover:text-yellow-400 font-medium">
                  {profile?.first_name || user.email || "Пользователь"}
                </span>
              </Link>

              {/* 🔥 Новая кнопка — Личный кабинет */}
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

          {/* мобильное меню */}
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
        className={`md:hidden bg-black py-2 px-4 ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col space-y-3">
          <a href="#courses" className="hover:text-yellow-400 transition">
            Курсы
          </a>
          <a href="#about" className="hover:text-yellow-400 transition">
            О платформе
          </a>
          <a href="#achievements" className="hover:text-yellow-400 transition">
            Достижения
          </a>
          {user && (
            <>
              <Link to="/profile" className="text-yellow-500 hover:text-yellow-400 transition">
                Профиль
              </Link>
              <Link to="/cabinet" className="text-yellow-500 hover:text-yellow-400 transition">
                Личный кабинет
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
