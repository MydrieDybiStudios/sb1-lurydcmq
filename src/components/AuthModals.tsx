import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onCloseLogin: () => void;
  onCloseRegister: () => void;
  onSwitchToLogin: () => void;
  onSwitchToRegister: () => void;
  onAuthSuccess: () => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({
  isLoginOpen,
  isRegisterOpen,
  onCloseLogin,
  onCloseRegister,
  onSwitchToLogin,
  onSwitchToRegister,
  onAuthSuccess,
}) => {
  // Состояния для логина
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Состояния для регистрации
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Вход через email/password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      onAuthSuccess();
      onCloseLogin();
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  // Регистрация
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (registerPassword !== confirmPassword) {
      setRegisterError('Пароли не совпадают.');
      return;
    }

    if (!acceptTerms) {
      setRegisterError('Вы должны принять условия использования.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: { name: registerName },
        },
      });

      if (error) throw error;

      onAuthSuccess();
      onCloseRegister();
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isLoginOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onCloseLogin}
      >
        {/* Затемнение фона с размытием */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

        {/* Модальное окно */}
        <div
          className={`relative bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 border border-yellow-500/20 ${
            isLoginOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            {/* Кнопка закрытия */}
            <button
              onClick={onCloseLogin}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Заголовок */}
            <h3 className="text-3xl font-bold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
                Вход в аккаунт
              </span>
            </h3>
            <p className="text-gray-400 mb-8">Войдите, чтобы продолжить обучение</p>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Запомнить меня */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${
                      rememberMe
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'border-gray-600 bg-transparent'
                    }`}
                  >
                    {rememberMe && <CheckCircle className="w-4 h-4 text-black" />}
                  </div>
                  <span className="ml-3 text-sm text-gray-300">Запомнить меня</span>
                </label>

                <button
                  type="button"
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition"
                >
                  Забыли пароль?
                </button>
              </div>

              {loginError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {loginError}
                </p>
              )}

              {/* Кнопка входа */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/30"
              >
                Войти
              </button>

              {/* Ссылка на регистрацию */}
              <p className="text-center text-sm text-gray-400 mt-6">
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-yellow-400 hover:text-yellow-300 font-medium ml-1"
                >
                  Зарегистрироваться
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isRegisterOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={onCloseRegister}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

        <div
          className={`relative bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 border border-yellow-500/20 ${
            isRegisterOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={onCloseRegister}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-3xl font-bold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
                Регистрация
              </span>
            </h3>
            <p className="text-gray-400 mb-8">Создайте аккаунт и начните обучение</p>

            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              {/* Имя */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Подтверждение пароля */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Согласие с условиями */}
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="sr-only"
                />
                <div
                  className={`flex-shrink-0 w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${
                    acceptTerms
                      ? 'bg-yellow-500 border-yellow-500'
                      : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {acceptTerms && <CheckCircle className="w-4 h-4 text-black" />}
                </div>
                <span className="ml-3 text-sm text-gray-300">
                  Я принимаю{' '}
                  <Link
                    to="/terms-of-service"
                    className="text-yellow-500 hover:text-yellow-400 font-medium"
                    target="_blank"
                  >
                    условия использования
                  </Link>
                </span>
              </label>

              {registerError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {registerError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/30 mt-4"
              >
                Зарегистрироваться
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-yellow-400 hover:text-yellow-300 font-medium ml-1"
                >
                  Войти
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Стили для скролла в модалке регистрации */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,215,0,0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,215,0,0.5);
        }
      `}</style>
    </>
  );
};

export default AuthModals;
