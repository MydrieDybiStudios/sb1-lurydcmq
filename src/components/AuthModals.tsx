import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onCloseLogin: () => void;
  onCloseRegister: () => void;
  onSwitchToLogin: () => void;
  onSwitchToRegister: () => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({
  isLoginOpen,
  isRegisterOpen,
  onCloseLogin,
  onCloseRegister,
  onSwitchToLogin,
  onSwitchToRegister,
}) => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Вход выполнен успешно! (Это демо-версия, реальная авторизация не реализована)');
    onCloseLogin();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Регистрация прошла успешно! (Это демо-версия, реальная регистрация не реализована)');
    onCloseRegister();
  };

  return (
    <>
      {/* Login Modal */}
      <div className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isLoginOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Вход в аккаунт</h3>
              <button onClick={onCloseLogin} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>
            
            <form id="loginForm" className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="loginEmail" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input 
                  type="password" 
                  id="loginPassword" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Запомнить меня</label>
                </div>
                <a href="#" className="text-sm text-yellow-600 hover:text-yellow-700">Забыли пароль?</a>
              </div>
              
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition">
                Войти
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Или войдите через</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                  <span>VK</span>
                </button>
                <button type="button" className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition">
                  <span>Google</span>
                </button>
              </div>
              
              <p className="text-center text-sm text-gray-600">
                Нет аккаунта? 
                <button type="button" onClick={onSwitchToRegister} className="text-yellow-600 hover:text-yellow-700 font-medium ml-1">
                  Зарегистрироваться
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isRegisterOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Регистрация</h3>
              <button onClick={onCloseRegister} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>
            
            <form id="registerForm" className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input 
                  type="text" 
                  id="registerName" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="registerEmail" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input 
                  type="password" 
                  id="registerPassword" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="registerConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
                <input 
                  type="password" 
                  id="registerConfirmPassword" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="acceptTerms" 
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" 
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  required 
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  Я принимаю <a href="#" className="text-yellow-600 hover:text-yellow-700">условия использования</a>
                </label>
              </div>
              
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition">
                Зарегистрироваться
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Уже есть аккаунт? 
                <button type="button" onClick={onSwitchToLogin} className="text-yellow-600 hover:text-yellow-700 font-medium ml-1">
                  Войти
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModals;