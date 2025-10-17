import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ZoomIn, X } from "lucide-react";

// Импортируем фото из папки logos
import history1 from "../logos/история1.jpg";
import history2 from "../logos/история2.jpg";
import history3 from "../logos/история3.jpg";
import history4 from "../logos/история4.jpg";
import career1 from "../logos/оператор.jpg";
import career2 from "../logos/бурильщик (2).jpg";
import career3 from "../logos/лаборант.jpg";

const ARModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"history" | "career">("history");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Данные для модуля "История Югорской Нефти" - ФОТО
  const historyImages = [
    {
      id: 1,
      title: "Обустройство месторождений (Исторические кадры)",
      description: "Посмотрите, как обустраивали месторождения 1970-х годах",
      image: history1,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    },
    {
      id: 2,
      title: "Работа нефтяников (Исторические кадры)",
      description: "Посмотрите, как работали нефтяники в 1970-х годах",
      image: history2,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    },
    {
      id: 3,
      title: "Сокровище Самотлора (Кинофильм 1972 года)",
      description: "Посмотрите фильм, который описывает процесс добычи нефти, транспортировки оборудования и строительство города нефтяников.",
      image: history3,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    },
    {
      id: 4,
      title: "Геологоразведка залежей нефти Югры (Исторические кадры)",
      description: "Открытие и введение в эксплуатацию первых месторождений Югры ",
      image: history4,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    }
  ];

  // Данные для профориентационного модуля - ФОТО
  const careerImages = [
    {
      id: 1,
      title: "Профессия: Оператор",
      description: "Работа оператора в нефтяной промышленности",
      image: career1,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    },
    {
      id: 2,
      title: "Профессия: Бурильщик",
      description: "Ежедневные задачи бурильщика на месторождении",
      image: career2,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    },
    {
      id: 3,
      title: "Профессия: Лаборант",
      description: "Работа в нефтяной лаборатории",
      image: career3,
      arInstructions: "Для AR-просмотра скачайте приложение и наведитесь на фото"
    }
  ];

  const currentImages = activeTab === "history" ? historyImages : careerImages;

  const handleDownloadApp = () => {
    // В реальном приложении здесь будет ссылка на скачивание
    alert("Ссылка на скачивание приложения 'Югра.Нефть AR' будет доступна в ближайшее время");
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AR-модуль</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Просматривайте фото и используйте AR-функции через мобильное приложение
          </p>
        </div>

        {/* Баннер с информацией о приложении */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-8 text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Download className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">AR-функции в приложении</h2>
          </div>
          <p className="text-lg mb-4 max-w-2xl mx-auto">
            Для интерактивного AR-просмотра скачайте мобильное приложение "Югра.Нефть AR"
          </p>
          <button
            onClick={handleDownloadApp}
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 inline-flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Скачать приложение
          </button>
        </div>

        {/* Переключение модулей */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              История Югорской Нефти
            </button>
            <button
              onClick={() => setActiveTab("career")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "career"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Профориентационный модуль
            </button>
          </div>
        </div>

        {/* Контент модуля - ФОТОГРАФИИ */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            {activeTab === "history" 
              ? "История Югорской Нефти - 4 фото" 
              : "Профориентационный модуль - 3 фото"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentImages.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-6 border-2 border-yellow-200">
                {/* Контейнер для фото */}
                <div 
                  className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                  onClick={() => openImageModal(item.image)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Нажмите для увеличения
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                  📱 {item.arInstructions}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Инструкция */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Как использовать AR-модуль:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Просматривайте фото непосредственно на сайте</li>
            <li>Для AR-функций скачайте мобильное приложение "Югра.Нефть AR"</li>
            <li>Запустите приложение и отсканируйте специальные метки на фотографиях</li>
            <li>Наслаждайтесь интерактивным AR-контентом</li>
          </ol>
        </div>

        {/* Кнопка возврата */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/cabinet")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
          >
            Вернуться в кабинет
          </button>
        </div>
      </div>

      {/* Модальное окно для просмотра фото */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-full">
            <div className="relative">
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-white text-center mb-2">
                  <ZoomIn className="w-6 h-6 inline mr-2" />
                  Используйте колесико мыши для увеличения
                </div>
                <img
                  src={selectedImage}
                  alt="Увеличенное изображение"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="text-white text-center mt-2 text-sm">
                  Для AR-просмотра скачайте мобильное приложение
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARModule;
