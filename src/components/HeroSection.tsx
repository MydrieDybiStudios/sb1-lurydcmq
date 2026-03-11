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
      // Авторизован → личный кабинет
      navigate('/cabinet');
    } else {
      // Не авторизован → скролл к CTA-секции
      document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black overflow-hidden py-20 md:py-28">
      {/* волнистый элемент, полоска и остальной код — без изменений */}
      <div className="absolute bottom-0 left-0 right-0 text-black">
        <svg ...>...</svg>
      </div>

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

      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>
    </section>
  );
};

export default HeroSection;
