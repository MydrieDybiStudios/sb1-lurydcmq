import React, { useState } from 'react';
import { X } from 'lucide-react';
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
  const [loginSuccess, setLoginSuccess] = useState('');

  // Состояния для регистрации
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Вход через email/password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        throw error;
      }

      setLoginSuccess('Вход выполнен успешно!');
      onAuthSuccess();
      setTimeout(() => {
        onCloseLogin();
        window.location.href = '/cabinet';
      }, 1000);

    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  // Регистрация
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

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

      if (error) {
        throw error;
      }

      setRegisterSuccess('Регистрация прошла успешно! Проверьте почту для подтверждения.');
      onAuthSuccess();
      setTimeout(() => {
        onCloseRegister();
      }, 3000);

    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isLoginOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-300`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Вход в аккаунт</h3>
              <button onClick={onCloseLogin} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    Запомнить меня
                  </label>
                </div>
              </div>

              {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
              {loginSuccess && <p className="text-green-600 text-sm">{loginSuccess}</p>}

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition duration-200"
              >
                Войти
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Нет аккаунта?
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-yellow-600 hover:text-yellow-700 font-medium ml-1"
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
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isRegisterOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-300`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Регистрация</h3>
              <button onClick={onCloseRegister} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                  Я принимаю <Link to="/terms-of-service" className="text-yellow-600 hover:text-yellow-700">условия использования</Link>
                </label>
              </div>

              {registerError && <p className="text-red-600 text-sm">{registerError}</p>}
              {registerSuccess && <p className="text-green-600 text-sm">{registerSuccess}</p>}

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition duration-200"
              >
                Зарегистрироваться
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Уже есть аккаунт?
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-yellow-600 hover:text-yellow-700 font-medium ml-1"
                >
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
