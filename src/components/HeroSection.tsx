import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const HeroSection: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const handleStartLearning = () => {
    if (user) {
      navigate('/cabinet');
    } else {
      const ctaElement = document.getElementById('cta');
      if (ctaElement) {
        ctaElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('Элемент с id "cta" не найден на странице. Убедитесь, что компонент CtaSection отрендерен и содержит id="cta".');
        // Можно добавить запасной вариант, например, переход на страницу регистрации:
        // navigate('/register');
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black overflow-hidden py-20 md:py-28">
      {/* Волнистый чёрный элемент внизу */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-black opacity-10">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="inline-block animate-fadeInUp">Цифровая образовательная платформа</span>
            <br />
            <span className="bg-black text-yellow-400 px-4 py-2 rounded-lg inline-block mt-2 shadow-2xl animate-fadeInUp animation-delay-200">
              «Югра.Нефть»
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-black/80 max-w-3xl mx-auto animate-fadeInUp animation-delay-400">
            Изучайте нефтегазовую отрасль с помощью интерактивных курсов, тестов и достижений. Получайте сертификаты и становитесь экспертом!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animation-delay-600">
            <button
              onClick={handleStartLearning}
              className="bg-black text-yellow-400 hover:bg-gray-900 font-bold py-4 px-8 rounded-full transition transform hover:scale-110 hover:shadow-xl flex items-center justify-center text-lg border-2 border-black"
            >
              Начать обучение
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-black bg-transparent hover:bg-black hover:text-yellow-400 font-bold py-4 px-8 rounded-full transition transform hover:scale-110 hover:shadow-xl flex items-center justify-center text-lg"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </div>

      {/* Чёрная полоска вверху для акцента */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>
    </section>
  );
};

export default HeroSection;
