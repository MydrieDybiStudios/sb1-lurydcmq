import React from 'react';

interface CtaSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onLogin, onRegister }) => {
  return (
    <section className="py-16 gradient-bg text-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Готовы начать обучение?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Присоединяйтесь к платформе "НефтеГаз-Квант" и откройте для себя увлекательный мир нефтегазовой отрасли!
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
      </div>
    </section>
  );
};

export default CtaSection;