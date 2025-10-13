import React, { useEffect, useState } from 'react';
import { CheckCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const [userName, setUserName] = useState<string>('Участник');

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

  let resultTitle = '';
  let resultClass = '';
  if (percentage >= 90) { resultTitle = 'Превосходный результат!'; resultClass = 'bg-green-500'; }
  else if (percentage >= 70) { resultTitle = 'Хороший результат!'; resultClass = 'bg-yellow-500'; }
  else if (percentage >= 50) { resultTitle = 'Тест пройден!'; resultClass = 'bg-yellow-400'; }
  else { resultTitle = 'Стоит повторить материал'; resultClass = 'bg-red-500'; }

  const handleDownloadCertificate = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();

    const borderColor = rgb(0.9, 0.7, 0.1);
    const borderWidth = 4;
    const innerOffset = 14;

    page.drawRectangle({ x: borderWidth / 2, y: borderWidth / 2, width: width - borderWidth, height: height - borderWidth, borderColor, borderWidth });
    page.drawRectangle({ x: innerOffset, y: innerOffset, width: width - innerOffset * 2, height: height - innerOffset * 2, borderColor: rgb(0.85, 0.65, 0.05), borderWidth: 1.5 });

    page.drawText('СЕРТИФИКАТ ДОСТИЖЕНИЙ', { x: 120, y: height - 90, size: 22, font, color: borderColor });
    page.drawText(`Поздравляем, ${userName}!`, { x: 100, y: height - 160, size: 16, font, color: rgb(0, 0, 0) });
    page.drawText(`Вы успешно завершили курс:`, { x: 100, y: height - 190, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText(`"${courseName}"`, { x: 120, y: height - 220, size: 14, font, color: rgb(0.1, 0.1, 0.1) });

    const date = new Date().toLocaleDateString('ru-RU');
    page.drawText(`Дата выдачи: ${date}`, { x: 100, y: height - 280, size: 12, font, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(`Образовательная платформа "Югра.Нефть"`, { x: 100, y: 40, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Сертификат_${userName}_${courseName}.pdf`;
    link.click();
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`${isPassed ? 'bg-green-100' : 'bg-red-100'} rounded-full w-20 h-20 flex items-center justify-center`}>
          {isPassed ? (
            <CheckCircle className={`${percentage >= 90 ? 'text-green-600' : 'text-yellow-600'} w-10 h-10`} />
          ) : <div className="text-red-600 text-3xl">!</div>}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">{resultTitle}</h3>
      <p className="text-lg text-gray-700 mb-4">
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
      </p>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className={`${resultClass} h-4 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-sm text-gray-600">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && (
        <div className="mb-8">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
            onClick={handleDownloadCertificate}
          >
            <Award className="mr-2 w-5 h-5" /> Получить сертификат
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <button className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition" onClick={onClose}>
          Вернуться к курсам
        </button>
      </div>
    </div>
  );
};

export default ResultsComponent;
