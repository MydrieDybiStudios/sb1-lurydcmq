import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link } from "react-router-dom";
<Link to="/profile" className="text-yellow-600 hover:underline">
  Профиль
</Link>

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
            UO
          </div>
          <h1 className="text-xl font-bold">Цифровая Образовательная Платформа "Югра.Нефть"</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#courses" className="hover:text-yellow-400 transition">Курсы</a>
          <a href="#about" className="hover:text-yellow-400 transition">О платформе</a>
          <a href="#achievements" className="hover:text-yellow-400 transition">Достижения</a>
        </nav>
        <div className="flex items-center space-x-4">
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
          <button 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="text-xl" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-black py-2 px-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <a href="#courses" className="hover:text-yellow-400 transition">Курсы</a>
          <a href="#about" className="hover:text-yellow-400 transition">О платформе</a>
          <a href="#achievements" className="hover:text-yellow-400 transition">Достижения</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
