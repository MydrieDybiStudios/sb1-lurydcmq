import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface CtaSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onLogin, onRegister }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string } | null>(null);
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
          .select("first_name")
          .eq("id", currentUser.id)
          .maybeSingle();
        if (profData) setProfile(profData);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try {
        (sub as any)?.unsubscribe?.();
      } catch {}
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 gradient-bg text-black text-center">
        <p>Загрузка...</p>
      </section>
    );
  }

  return (
    <section className="py-16 gradient-bg text-black">
      <div className="container mx-auto px-4 text-center">
        {user ? (
          <>
            <h2 className="text-3xl font-bold mb-4">
              👋 Добро пожаловать, {profile?.first_name || "друзья"}!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Успехов в обучении и отличных результатов на платформе{" "}
              <span className="font-semibold">«Югра.Нефть»</span>!
            </p>
            <button
              onClick={() => navigate("/cabinet")}
              className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition"
            >
              Перейти в личный кабинет
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6">Готовы начать обучение?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к платформе{" "}
              <span className="font-semibold">«Югра.Нефть»</span> и откройте
              для себя увлекательный мир нефтегазовой отрасли!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onRegister}
                className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition"
              >
                Зарегистрироваться
              </button>
              <button
                onClick={onLogin}
                className="border-2 border-black hover:bg-black hover:text-white font-medium py-3 px-8 rounded-lg transition"
              >
                Войти
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CtaSection;
