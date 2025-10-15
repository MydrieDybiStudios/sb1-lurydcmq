import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, School, MessageCircle, Send } from 'lucide-react';

// Импортируем круглый логотип
import logo from "../logos/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Бренд и описание */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={logo} 
                alt="Югра.Нефть" 
                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
              />
              <div>
                <h3 className="font-bold text-2xl">Югра.Нефть</h3>
                <p className="text-yellow-400 text-lg font-medium">Образовательная платформа</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Инновационная цифровая платформа для изучения нефтегазовой отрасли. 
              Интерактивные курсы, тесты и система достижений для школьников, 
              разработанные учащимися Роснефть-класса МОБУ СОШ №1.
            </p>
            
            {/* Социальные сети */}
            <div className="mt-8">
              <h5 className="font-bold mb-4 text-yellow-400 text-lg">Мы в соцсетях</h5>
              <div className="flex space-x-4">
                <a 
                  href="https://vk.com/vrcomplex" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="ВКонтакте"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://t.me/ugraneft" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="Telegram"
                >
                  <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="mailto:virtuallearningcomplex@gmail.com"
                  className="bg-gray-800 hover:bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Навигация */}
          <div>
            <h4 className="font-bold mb-6 text-yellow-400 text-xl border-b border-yellow-400 pb-2">Навигация</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Главная страница
                </Link>
              </li>
              <li>
                <Link 
                  to="/reviews" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Отзывы учеников
                </Link>
              </li>
              <li>
                <Link 
                  to="/cabinet" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Мой профиль
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Контакты */}
          <div>
            <h4 className="font-bold mb-6 text-yellow-400 text-xl border-b border-yellow-400 pb-2">Контакты</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group hover:translate-x-1 transition-transform duration-200">
                <div className="bg-yellow-400 text-black p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a 
                    href="mailto:virtuallearningcomplex@gmail.com" 
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-lg font-medium"
                  >
                    virtuallearningcomplex@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group hover:translate-x-1 transition-transform duration-200">
                <div className="bg-yellow-400 text-black p-2 rounded-full group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Адрес</p>
                  <p className="text-gray-300 text-lg font-medium">пгт. Пойковский, ХМАО-Югра</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 group hover:translate-x-1 transition-transform duration-200">
                <div className="bg-yellow-400 text-black p-2 rounded-full group-hover:scale-110 transition-transform">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Школа</p>
                  <p className="text-gray-300 text-lg font-medium">МОБУ СОШ №1</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Нижняя часть */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <p className="text-gray-400 text-lg">
              © 2025 Цифровая образовательная платформа "Югра.Нефть"
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Все права защищены. Проект разработан учащимися Роснефть-класса МОБУ СОШ №1.
            </p>
          </div>
          <div className="flex space-x-8">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-yellow-400 text-lg transition-all duration-200 hover:underline"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              to="/terms-of-service" 
              className="text-gray-400 hover:text-yellow-400 text-lg transition-all duration-200 hover:underline"
            >
              Условия использования
            </Link>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
           Пойковский, Ханты-Мансийский автономный округ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
