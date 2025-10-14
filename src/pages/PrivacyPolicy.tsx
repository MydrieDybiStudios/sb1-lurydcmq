import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Link to="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6">
            ← Назад на главную
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Политика конфиденциальности</h1>
          <p className="text-gray-600 mb-8">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящая Политика конфиденциальности регулирует порядок сбора, использования, хранения и раскрытия 
                информации, полученной от пользователей образовательной платформы "Югра.Нефть".
              </p>
              <p className="text-gray-700">
                Используя наш сайт, вы соглашаетесь с условиями данной Политики конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Собираемая информация</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Личные данные (имя, фамилия, класс, школа)</li>
                <li>Адрес электронной почты</li>
                <li>Результаты прохождения курсов и тестирования</li>
                <li>Данные о прогрессе обучения</li>
                <li>Техническая информация (IP-адрес, тип браузера, время доступа)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Использование информации</h2>
              <p className="text-gray-700 mb-4">Собранная информация используется для:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Предоставления образовательных услуг</li>
                <li>Отслеживания прогресса обучения</li>
                <li>Улучшения качества образовательной платформы</li>
                <li>Обратной связи с пользователями</li>
                <li>Обеспечения безопасности платформы</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Защита данных</h2>
              <p className="text-gray-700">
                Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного 
                доступа, изменения, раскрытия или уничтожения. Все данные хранятся на защищенных серверах 
                и передаются в зашифрованном виде.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Права пользователей</h2>
              <p className="text-gray-700 mb-4">Вы имеете право:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Запрашивать доступ к вашим персональным данным</li>
                <li>Запрашивать исправление неточной информации</li>
                <li>Запрашивать удаление ваших данных</li>
                <li>Отзывать согласие на обработку данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Контакты</h2>
              <p className="text-gray-700">
                По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:
              </p>
              <p className="text-gray-700 mt-2">
                Email: <span className="text-yellow-600">virtuallearningcomplex@gmail.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
