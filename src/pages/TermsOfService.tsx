import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Link to="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6">
            ← Назад на главную
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Условия использования</h1>
          <p className="text-gray-600 mb-8">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Принятие условий</h2>
              <p className="text-gray-700">
                Используя образовательную платформу "Югра.Нефть", вы подтверждаете, что прочитали, поняли 
                и соглашаетесь соблюдать настоящие Условия использования.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Условия регистрации</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Регистрация разрешена учащимся 1-11 классов</li>
                <li>При регистрации необходимо предоставить достоверную информацию</li>
                <li>Один пользователь может иметь только одну учетную запись</li>
                <li>Запрещена передача учетной записи третьим лицам</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Правила использования</h2>
              <p className="text-gray-700 mb-4">Пользователям запрещено:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Использовать платформу в незаконных целях</li>
                <li>Попытки взлома или нарушения работы платформы</li>
                <li>Распространение вредоносного программного обеспечения</li>
                <li>Создание помех работе других пользователей</li>
                <li>Нарушение авторских прав на образовательный контент</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Образовательный контент</h2>
              <p className="text-gray-700">
                Все образовательные материалы, включая курсы, тесты, изображения и тексты, являются 
                интеллектуальной собственностью платформы "Югра.Нефть" и защищены авторским правом.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Ответственность</h2>
              <p className="text-gray-700">
                Платформа предоставляется "как есть". Мы не несем ответственности за временные 
                перебои в работе, вызванные техническими неполадками или действиями третьих лиц.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Изменения условий</h2>
              <p className="text-gray-700">
                Мы оставляем за собой право вносить изменения в настоящие Условия использования. 
                Об изменениях пользователи будут уведомлены через платформу или по электронной почте.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Контакты</h2>
              <p className="text-gray-700">
                По вопросам, связанным с использованием платформы, обращайтесь:
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

export default TermsOfService;
