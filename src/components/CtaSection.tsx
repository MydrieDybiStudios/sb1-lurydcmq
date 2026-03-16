import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Target, Rocket } from "lucide-react";

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
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-300">Загрузка...</p>
        </div>
      </section>
    );
  }

  // Пользователь авторизован
  if (user) {
    // Если направление не выбрано – предлагаем тест
    if (!profile?.direction) {
      return (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
          {/* Декоративные элементы */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Приветственная иконка */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl mb-8 shadow-2xl transform hover:scale-110 transition">
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Привет, {profile?.first_name || "друг"}! 👋
              </h2>
              
              <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Похоже, ты ещё не выбрал направление. Пройди наш тест, чтобы мы могли порекомендовать подходящие курсы.
              </p>
              
              <button
                onClick={() => navigate("/career-test")}
                className="group bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 text-lg"
              >
                <Target className="w-5 h-5 group-hover:rotate-12 transition" />
                Пройти тест на профессию
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
          
          {/* Нижняя волна */}
          <div className="absolute bottom-0 left-0 right-0 text-black opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-current">
              <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      );
    }

    // Направление выбрано – стандартное приветствие
    return (
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Фоновые круги */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-2xl mb-8 shadow-2xl transform hover:scale-110 transition">
              <Rocket className="w-10 h-10 text-black" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
                Добро пожаловать, {profile?.first_name || "друзья"}!
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Успехов в обучении и отличных результатов на платформе{" "}
              <span className="font-bold text-yellow-400">«Югра.Нефть»</span>!
            </p>
            
            <button
              onClick={() => navigate("/cabinet")}
              className="group bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 text-lg"
            >
              Перейти в личный кабинет
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
        
        {/* Нижняя волна */}
        <div className="absolute bottom-0 left-0 right-0 text-yellow-500/5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-current">
            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
    );
  }

  // Пользователь не авторизован – предложение зарегистрироваться
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Фоновые декорации */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Готовы начать обучение?
          </h2>
          <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Присоединяйтесь к платформе{' '}
            <span className="font-bold">«Югра.Нефть»</span> и откройте
            для себя увлекательный мир нефтегазовой отрасли!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onRegister}
              className="group bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 text-lg"
            >
              <span>Зарегистрироваться</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onLogin}
              className="group border-2 border-black hover:bg-black hover:text-white text-black font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 text-lg"
            >
              <span>Войти</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Нижняя волна */}
      <div className="absolute bottom-0 left-0 right-0 text-black opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-current">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default CtaSection;
