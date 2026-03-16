import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface CtaSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onLogin, onRegister }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string; direction?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("first_name, direction")
          .eq("id", currentUser.id)
          .maybeSingle();
        if (profData) setProfile(profData);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("first_name, direction")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setProfile(data);
          });
      } else {
        setProfile(null);
      }
    });

    return () => {
      try {
        (sub as any)?.unsubscribe?.();
      } catch {}
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
          <p className="mt-4 text-black/70">Загрузка...</p>
        </div>
      </section>
    );
  }

  // Единый стиль для всех вариантов – как в HeroSection
  const commonClasses = "relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black overflow-hidden py-20 md:py-28";

  // Стиль кнопки – как в HeroSection
  const buttonClass = "bg-black text-yellow-400 hover:bg-gray-900 font-bold py-4 px-8 rounded-full transition transform hover:scale-110 hover:shadow-xl border-2 border-black";

  // Волнистый элемент внизу (как в HeroSection)
  const waveSvg = (
    <div className="absolute bottom-0 left-0 right-0 text-black">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );

  // Пользователь авторизован
  if (user) {
    // Если направление не выбрано – предлагаем тест
    if (!profile?.direction) {
      return (
        <section className={commonClasses}>
          {waveSvg}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Привет, {profile?.first_name || "друг"}! 👋
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-black/80 max-w-3xl mx-auto">
                Похоже, ты ещё не выбрал направление. Пройди наш тест, чтобы мы могли порекомендовать подходящие курсы.
              </p>
              <button
                onClick={() => navigate("/career-test")}
                className={buttonClass}
              >
                Пройти тест на профессию
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Направление выбрано – стандартное приветствие
    return (
      <section className={commonClasses}>
        {waveSvg}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Добро пожаловать, {profile?.first_name || "друзья"}!
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-black/80 max-w-3xl mx-auto">
              Успехов в обучении и отличных результатов на платформе{" "}
              <span className="font-semibold">«Югра.Нефть»</span>!
            </p>
            <button
              onClick={() => navigate("/cabinet")}
              className={buttonClass}
            >
              Перейти в личный кабинет
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Пользователь не авторизован – предложение зарегистрироваться
  return (
    <section className={commonClasses}>
      {waveSvg}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Готовы начать обучение?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-black/80 max-w-3xl mx-auto">
            Присоединяйтесь к платформе{" "}
            <span className="font-semibold">«Югра.Нефть»</span> и откройте
            для себя увлекательный мир нефтегазовой отрасли!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onRegister}
              className={buttonClass}
            >
              Зарегистрироваться
            </button>
            <button
              onClick={onLogin}
              className={buttonClass}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
