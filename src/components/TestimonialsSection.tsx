import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Отзывы наших учеников</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                А
              </div>
              <div>
                <h4 className="font-bold">Алексей Смирнов</h4>
                <p className="text-sm text-gray-500">Ученик 10 класса</p>
              </div>
            </div>
            <p className="text-gray-700">
              "Курсы очень интересные и понятные. Особенно понравились видеоуроки с наглядными примерами. Теперь я лучше понимаю, как работает нефтегазовая отрасль."
            </p>
            <div className="mt-3 text-yellow-500 flex">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                Е
              </div>
              <div>
                <h4 className="font-bold">Екатерина Иванова</h4>
                <p className="text-sm text-gray-500">Ученица 11 класса</p>
              </div>
            </div>
            <p className="text-gray-700">
              "Отличная платформа для тех, кто хочет разобраться в нефтегазовой теме. Тесты помогают закрепить материал, а система достижений мотивирует учиться дальше."
            </p>
            <div className="mt-3 text-yellow-500 flex">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <StarHalf className="fill-current" />
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                Д
              </div>
              <div>
                <h4 className="font-bold">Дмитрий Петров</h4>
                <p className="text-sm text-gray-500">Ученик 9 класса</p>
              </div>
            </div>
            <p className="text-gray-700">
              "После прохождения курсов я понял, что хочу связать свою будущую профессию с нефтегазовой отраслью. Спасибо за доступное изложение сложных тем!"
            </p>
            <div className="mt-3 text-yellow-500 flex">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;