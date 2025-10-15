import React from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import Footer from "../components/Footer";

// Импортируем круглый логотип
import logo from "../logos/logo.png";

const ReviewsPage: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Алексей Смирнов",
      class: "Ученик 10 класса",
      initial: "А",
      text: "Курсы очень интересные и понятные. Особенно понравились видеоуроки с наглядными примерами. Теперь я лучше понимаю, как работает нефтегазовая отрасль.",
      rating: 5
    },
    {
      id: 2,
      name: "Екатерина Иванова",
      class: "Ученица 11 класса", 
      initial: "Е",
      text: "Отличная платформа для тех, кто хочет разобраться в нефтегазовой теме. Тесты помогают закрепить материал, а система достижений мотивирует учиться дальше.",
      rating: 4.5
    },
    {
      id: 3,
      name: "Дмитрий Петров",
      class: "Ученик 9 класса",
      initial: "Д",
      text: "После прохождения курсов я понял, что хочу связать свою будущую профессию с нефтегазовой отраслью. Спасибо за доступное изложение сложных тем!",
      rating: 5
    },
    {
      id: 4,
      name: "Мария Козлова",
      class: "Ученица 10 класса",
      initial: "М",
      text: "Очень понравилась структура курсов. Материал подается постепенно, от простого к сложному. Система тестирования помогает проверить знания.",
      rating: 5
    },
    {
      id: 5,
      name: "Артем Новиков",
      class: "Ученик 11 класса",
      initial: "А",
      text: "Платформа помогла мне подготовиться к олимпиаде по географии. Особенно полезными оказались материалы по геологии нефти и газа.",
      rating: 4
    },
    {
      id: 6,
      name: "София Васнецова",
      class: "Ученица 8 класса",
      initial: "С",
      text: "Я только начала изучать нефтегазовую отрасль, и эти курсы стали отличным стартом. Все объяснения очень доступные и интересные!",
      rating: 5
    },
    {
      id: 7,
      name: "Иван Сидоров",
      class: "Ученик 10 класса",
      initial: "И",
      text: "Система достижений действительно мотивирует проходить курсы дальше. Хочется собрать все сертификаты и достижения!",
      rating: 4.5
    },
    {
      id: 8,
      name: "Анна Кузнецова",
      class: "Ученица 9 класса", 
      initial: "А",
      text: "Большое спасибо за качественные материалы. Особенно впечатлили интерактивные задания и 3D-модели оборудования.",
      rating: 5
    },
    {
      id: 9,
      name: "Павел Орлов",
      class: "Ученик 11 класса",
      initial: "П",
      text: "Курсы помогли определиться с будущей профессией. Теперь планирую поступать в нефтегазовый университет.",
      rating: 5
    },
    {
      id: 10,
      name: "Кристина Лебедева",
      class: "Ученица 10 класса",
      initial: "К",
      text: "Очень удобный интерфейс платформы. Можно учиться с любого устройства в удобное время. Это огромный плюс!",
      rating: 4
    },
    {
      id: 11,
      name: "Роман Волков",
      class: "Ученик 9 класса",
      initial: "Р",
      text: "Понравилось, что после каждого раздела есть практические задания. Это помогает лучше усвоить материал.",
      rating: 4.5
    },
    {
      id: 12,
      name: "Виктория Соколова",
      class: "Ученица 11 класса",
      initial: "В",
      text: "Отличная платформа для углубленного изучения нефтегазовой отрасли. Рекомендую всем, кто интересуется этой темой!",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-current" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} />);
    }

    return stars;
  };

  // Функция для открытия формы отзыва
  const handleLeaveReview = () => {
    window.open('https://forms.yandex.ru/u/662511a43e9d086b4aa04017', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Хедер */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            {/* КРУГЛЫЙ ЛОГОТИП */}
            <img 
              src={logo} 
              alt="Югра.Нефть" 
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold">
                Цифровая Образовательная Платформа "Югра.Нефть"
              </h1>
            </div>
          </Link>
          <Link 
            to="/"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Отзывы наших учеников</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Узнайте, что говорят учащиеся о нашей образовательной платформе
          </p>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{testimonials.length}</div>
            <div className="text-gray-600">Всего отзывов</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
            </div>
            <div className="text-gray-600">Средняя оценка</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {testimonials.filter(t => t.rating >= 4).length}
            </div>
            <div className="text-gray-600">Положительных отзывов</div>
          </div>
        </div>

        {/* Кнопка "Оставить отзыв" */}
        <div className="text-center mb-12">
          <button 
            onClick={handleLeaveReview}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            ✨ Оставить отзыв
          </button>
          <p className="text-gray-600 mt-3 text-sm">
            Поделитесь своим опытом обучения на нашей платформе
          </p>
        </div>

        {/* Отзывы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.class}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex text-yellow-500">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
