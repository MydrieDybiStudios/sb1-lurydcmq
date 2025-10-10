import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="gradient-bg text-black py-16 animate-fadeIn">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Образовательная платформа по нефтегазовой отрасли</h1>
          <p className="text-lg mb-6">Изучайте нефтегазовую отрасль с помощью интерактивных курсов, тестов и достижений. Получайте сертификаты и становитесь экспертом!</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <a 
              href="#courses" 
              className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg text-center transition"
            >
              Начать обучение
            </a>
            <a 
              href="#about" 
              className="border-2 border-black hover:bg-black hover:text-white font-medium py-3 px-6 rounded-lg text-center transition"
            >
              Узнать больше
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
            alt="Нефтегазовая отрасль" 
            className="rounded-lg shadow-2xl w-full max-w-md hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;