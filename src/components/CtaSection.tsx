import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, Rocket, ArrowRight, Zap } from "lucide-react";

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
      <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 overflow-hidden py-20">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          <p className="mt-4 text-black/70 text-lg">Загрузка...</p>
        </div>
      </section>
    );
  }

  // Общий фон hero
  const commonClasses = "relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black overflow-hidden py-20 md:py-28";

  // Волнистый элемент внизу (как в hero)
  const waveSvg = (
    <div className="absolute bottom-0 left-0 right-0 text-black">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );

  // Декоративные размытые круги
  const blobs = (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
    </>
  );

  // Светлая карточка для контента (чёрный текст будет хорошо виден)
  const contentCardClass = "relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/30";

  // Универсальный стиль кнопки (чёрная с жёлтым текстом)
  const buttonClass = "group bg-black text-yellow-400 hover:bg-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30 border-2 border-black/50 inline-flex items-center gap-3 text-lg";

  // Пользователь авторизован
  if (user) {
    // Если направление не выбрано
    if (!profile?.direction) {
      return (
        <section className={commonClasses}>
          {blobs}
          {waveSvg}
          <div className="container mx-auto px-4 relative">
            <div className={contentCardClass}>
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="bg-black rounded-full p-4 mb-6 shadow-lg transform hover:scale-110 transition">
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                  Привет, {profile?.first_name || "друг"}! 👋
                </h2>
                <p className="text-xl text-black/80 mb-8 max-w-2xl leading-relaxed">
                  Похоже, ты ещё не выбрал направление. Пройди наш тест, чтобы мы могли порекомендовать подходящие курсы.
                </p>
                <button
                  onClick={() => navigate("/career-test")}
                  className={buttonClass}
                >
                  <Target className="w-5 h-5 group-hover:rotate-12 transition" />
                  Пройти тест на профессию
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Направление выбрано
    return (
      <section className={commonClasses}>
        {blobs}
        {waveSvg}
        <div className="container mx-auto px-4 relative">
          <div className={contentCardClass}>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="bg-black rounded-full p-4 mb-6 shadow-lg transform hover:scale-110 transition">
                <Rocket className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                Добро пожаловать, {profile?.first_name || "друзья"}!
              </h2>
              <p className="text-xl text-black/80 mb-8 max-w-2xl leading-relaxed">
                Успехов в обучении и отличных результатов на платформе{" "}
                <span className="font-bold text-black">«Югра.Нефть»</span>!
              </p>
              <button
                onClick={() => navigate("/cabinet")}
                className={buttonClass}
              >
                Перейти в личный кабинет
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Не авторизован
  return (
    <section className={commonClasses}>
      {blobs}
      {waveSvg}
      <div className="container mx-auto px-4 relative">
        <div className={contentCardClass}>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="bg-black rounded-full p-4 mb-6 shadow-lg transform hover:scale-110 transition">
              <Zap className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Готовы начать обучение?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl leading-relaxed">
              Присоединяйтесь к платформе{" "}
              <span className="font-bold text-black">«Югра.Нефть»</span> и откройте
              для себя увлекательный мир нефтегазовой отрасли!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={onRegister}
                className={buttonClass}
              >
                Зарегистрироваться
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={onLogin}
                className={buttonClass}
              >
                Войти
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
