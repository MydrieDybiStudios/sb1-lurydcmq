import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ZoomIn, X, ArrowLeft, Scan, Smartphone, QrCode, Aperture } from "lucide-react";
import Footer from "../components/Footer";

// Импортируем фото из папки logos
import history1 from "../logos/история1.jpg";
import history2 from "../logos/история2.jpg";
import history3 from "../logos/история3.jpg";
import history4 from "../logos/история4.jpg";
import career1 from "../logos/оператор.jpg";
import career2 from "../logos/бурильщик (2).jpg";
import career3 from "../logos/лаборант.jpg";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

const ARModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"history" | "career">("history");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{[key: string]: boolean}>({});

  // Данные для модуля "История Югорской Нефти" - ФОТО
  const historyImages = [
    {
      id: 1,
      title: "Обустройство месторождений",
      description: "Исторические кадры обустройства нефтяных месторождений в 1970-х годах",
      image: history1,
      arInstructions: "Наведите камеру приложения на это изображение",
      year: "1970-е"
    },
    {
      id: 2,
      title: "Работа нефтяников",
      description: "Повседневная работа нефтяников в 1970-х годах на месторождениях",
      image: history2,
      arInstructions: "Сканируйте это фото через AR-приложение",
      year: "1970-е"
    },
    {
      id: 3,
      title: "Сокровище Самотлора",
      description: "Кадры из кинофильма 1972 года о добыче нефти и строительстве городов",
      image: history3,
      arInstructions: "AR-контент доступен через мобильное приложение",
      year: "1972"
    },
    {
      id: 4,
      title: "Геологоразведка Югры",
      description: "Открытие и введение в эксплуатацию первых месторождений Югры",
      image: history4,
      arInstructions: "Используйте приложение для дополненной реальности",
      year: "1960-е"
    }
  ];

  // Данные для профориентационного модуля - ФОТО
  const careerImages = [
    {
      id: 1,
      title: "Оператор нефтяных установок",
      description: "Управление технологическими процессами на нефтедобывающих объектах",
      image: career1,
      arInstructions: "Наведите камеру для AR-просмотра",
      requirements: "Среднее специальное образование"
    },
    {
      id: 2,
      title: "Бурильщик эксплуатационных скважин",
      description: "Работа на буровых установках и обслуживание скважин",
      image: career2,
      arInstructions: "Сканируйте это фото через AR-приложение",
      requirements: "Профессиональное обучение"
    },
    {
      id: 3,
      title: "Лаборант химического анализа",
      description: "Проведение анализов нефти и нефтепродуктов в лаборатории",
      image: career3,
      arInstructions: "AR-контент доступен через мобильное приложение",
      requirements: "Среднее специальное образование"
    }
  ];

  const currentImages = activeTab === "history" ? historyImages : careerImages;

  const handleDownloadApp = () => {
    // Заглушка для скачивания приложения
    window.open("https://example.com/download-yugra-neft-ar", "_blank");
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ===== HEADER ===== */}
      <header className="bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="Югра.Нефть" 
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                AR-модуль
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">Дополненная реальность • Югра.Нефть</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/cabinet")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
          >
            ← Назад
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Aperture className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
              Дополненная реальность
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Исследуйте историю и профессии нефтяной промышленности через инновационные 
              <span className="font-semibold text-blue-600"> AR-технологии</span>
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
              <button
                onClick={() => setActiveTab("history")}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                📜 Исторический архив
              </button>
              <button
                onClick={() => setActiveTab("career")}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === "career"
                    ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                💼 Карьерный гид
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {activeTab === "history" ? "Исторический архив" : "Профессии нефтяной отрасли"}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {currentImages.map((item) => (
                <div 
                  key={item.id}
                  className="group bg-white rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-200/30"
                >
                  <div className="relative overflow-hidden">
                    <div 
                      className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer relative"
                      onClick={() => openImageModal(item.image)}
                    >
                      {!imageLoaded[item.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                          imageLoaded[item.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(item.id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center space-x-2 mb-2">
                            <ZoomIn className="w-5 h-5" />
                            <span className="text-sm font-medium">Нажмите для увеличения</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                        {activeTab === "history" ? `📅 ${item.year}` : `🎯 ${item.requirements}`}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Scan className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800">AR-инструкция</p>
                          <p className="text-sm text-blue-700">{item.arInstructions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Как это работает</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Простой процесс для погружения в дополненную реальность
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Smartphone, step: "1", title: "Скачайте приложение", desc: "Установите наше AR-приложение" },
                { icon: QrCode, step: "2", title: "Найдите метки", desc: "Откройте приложение и найдите AR-метки" },
                { icon: Scan, step: "3", title: "Наведите камеру", desc: "Наведите камеру на изображения с метками" },
                { icon: Aperture, step: "4", title: "Исследуйте", desc: "Наслаждайтесь интерактивным контентом" }
              ].map((item, index) => (
                <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-blue-200/50">
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download Banner */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl shadow-2xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full"></div>
              </div>
              
              <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Download className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Начните AR-путешествие
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                  Скачайте приложение и откройте мир дополненной реальности
                </p>
                
                <button
                  onClick={handleDownloadApp}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-5 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 inline-flex items-center text-lg shadow-2xl hover:shadow-3xl"
                >
                  <Download className="w-6 h-6 mr-3" />
                  Скачать приложение
                </button>
                
                <div className="flex justify-center space-x-8 mt-8 text-blue-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>iOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Android</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Menu */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 inline-flex items-center shadow-2xl hover:shadow-3xl"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Вернуться в главное меню
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-6xl max-h-full w-full animate-scaleIn">
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <button
                onClick={closeImageModal}
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-10 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 text-white/80 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <ZoomIn className="w-4 h-4" />
                    <span className="text-sm">Используйте колесико мыши для увеличения</span>
                  </div>
                </div>
                
                <div className="flex justify-center bg-black rounded-2xl p-6 border border-white/10">
                  <img
                    src={selectedImage}
                    alt="Увеличенное изображение"
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
                
                <div className="text-center mt-6">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <p className="text-white text-lg mb-3">Для AR-просмотра скачайте мобильное приложение</p>
                    <button 
                      onClick={handleDownloadApp}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold text-lg underline transition-colors"
                    >
                      Скачать приложение "Югра.Нефть AR"
                    </button>
                  </div>
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
