import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="gradient-bg text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
                UO
              </div>
              <h3 className="font-bold">Югра.Нефть</h3>
            </div>
            <p className="text-gray-400">
              Образовательная платформа для школьников, изучающих нефтегазовую отрасль.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Курсы</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Введение в отрасль</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">История нефтедобычи</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Геология нефти и газа</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Методы добычи</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="text-yellow-400 mr-2">✉️</i>
                <span className="text-gray-400">virtuallearningcomplex@gmail.com</span>
              </li>
              <li className="flex items-center">
                <i className="text-yellow-400 mr-2">☎️</i>
                <span className="text-gray-400">Номер появится позже</span>
              </li>
              <li className="flex items-center">
                <i className="text-yellow-400 mr-2">📍</i>
                <span className="text-gray-400">Пойковский, Россия</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Социальные сети</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition">
                VK
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition">
                TG
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Югра.Нефть. Все права защищены.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition">Политика конфиденциальности</a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
