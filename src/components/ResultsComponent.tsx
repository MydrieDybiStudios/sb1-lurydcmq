import React, { useEffect, useState } from 'react';
import { CheckCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number; course_id: number } | null;
  courseName: string;
  onClose: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  results,
  courseName,
  onClose
}) => {
  const [userName, setUserName] = useState<string>(''); // 👤 сюда загрузим имя

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileData) {
        const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
        setUserName(fullName || 'Участник');
      }
    };

    loadUserProfile();
  }, []);

  if (!results) return null;

  const { score, total, percentage } = results;

  const isPassed = percentage >= 50;

  const handleDownloadCertificate = async () => {
    const name = userName || 'Участник';

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();

      // Рамка
      page.drawRectangle({
        x: 10,
        y: 10,
        width: width - 20,
        height: height - 20,
        borderColor: rgb(0.9, 0.7, 0.1),
        borderWidth: 4,
      });

      // Заголовок
      page.drawText('СЕРТИФИКАТ ДОСТИЖЕНИЙ', {
        x: 120,
        y: height - 80,
        size: 22,
        font,
        color: rgb(0.9, 0.7, 0.1),
      });

      page.drawText(`Поздравляем, ${name}!`, {
        x: 100,
        y: height - 140,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Вы успешно завершили курс:`, {
        x: 100,
        y: height - 170,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`"${courseName}"`, {
        x: 120,
        y: height - 200,
        size: 14,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      const date = new Date().toLocaleDateString('ru-RU');
      page.drawText(`Дата выдачи: ${date}`, {
        x: 100,
        y: height - 250,
        size: 12,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText(`Образовательная платформа "Югра.Нефть"`, {
        x: 100,
        y: 40,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Сертификат_${name}_${courseName}.pdf`;
      link.click();
    } catch (error) {
      console.error('Ошибка при создании сертификата:', error);
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`${isPassed ? 'bg-green-100' : 'bg-red-100'} rounded-full w-20 h-20 flex items-center justify-center`}>
          {isPassed ? (
            <CheckCircle className={`${percentage >= 90 ? 'text-green-600' : 'text-yellow-600'} w-10 h-10`} />
          ) : (
            <div className="text-red-600 text-3xl">!</div>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">
        {percentage >= 90 ? 'Превосходный результат!' :
         percentage >= 70 ? 'Хороший результат!' :
         percentage >= 50 ? 'Тест пройден!' :
         'Стоит повторить материал'}
      </h3>

      <p className="text-lg text-gray-700 mb-4">
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
      </p>

      {percentage >= 70 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Поздравляем! Вы можете получить именной сертификат.
          </p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
            onClick={handleDownloadCertificate}
          >
            <Award className="mr-2 w-5 h-5" />
            Получить сертификат
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-gray-600 mb-4">
          {isPassed
            ? 'Отличная работа! Продолжайте обучение.'
            : 'Рекомендуем повторить материал курса и пройти тест ещё раз.'}
        </p>
        <button
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition"
          onClick={onClose}
        >
          Вернуться к курсам
        </button>
      </div>
    </div>
  );
};

export default ResultsComponent;
