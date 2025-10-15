import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Компоненты
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const MainPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowLoginModal(true);
    // Здесь будет логика открытия модального окна входа
    console.log("Open login modal");
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
    // Здесь будет логика открытия модального окна регистрации
    console.log("Open register modal");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Шапка */}
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      
      {/* Основное содержимое */}
      <main className="flex-grow">
        {/* Герой-секция */}
        <HeroSection />
        
        {/* Секция с отзывами */}
        <TestimonialsSection />
        
        {/* Дополнительные секции можно добавить здесь */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Начните обучение сегодня</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам студентов, которые уже изучают нефтегазовую отрасль 
              с помощью нашей образовательной платформы
            </p>
            <button 
              onClick={handleRegister}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-8 rounded-lg transition"
            >
              Зарегистрироваться бесплатно
            </button>
          </div>
        </section>
      </main>
      
      {/* Подвал */}
      <Footer />
      
      {/* Модальные окна (заглушки) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Вход в систему</h3>
            <p className="text-gray-600 mb-4">Функционал входа будет реализован позже</p>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition w-full"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
      
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Регистрация</h3>
            <p className="text-gray-600 mb-4">Функционал регистрации будет реализован позже</p>
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded transition w-full"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
