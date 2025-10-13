// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, Award, X } from 'lucide-react';

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
  /**
   * Функция, вызываемая при запросе сертификата.
   * Должна вернуть Promise<string | null> — URL (созданный через URL.createObjectURL) на PDF blob для предпросмотра,
   * или null при ошибке.
   */
  onDownloadCertificate: (courseTitle: string) => Promise<string | null>;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  results,
  courseName,
  onClose,
  onDownloadCertificate,
}) => {
  const [userName, setUserName] = useState<string>(''); // сюда загрузим имя (если хотите — подтяните через props)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Если у вас в родителе/контексте есть имя — передавайте; здесь оставил заглушку.
    // setUserName(propsFromParent?.name ?? '');
  }, []);

  if (!results) return null;

  const { score, total, percentage } = results;
  const isPassed = percentage >= 50;

  let resultTitle = '';
  let resultClass = '';

  if (percentage >= 90) {
    resultTitle = 'Превосходный результат!';
    resultClass = 'bg-green-500';
  } else if (percentage >= 70) {
    resultTitle = 'Хороший результат!';
    resultClass = 'bg-yellow-500';
  } else if (percentage >= 50) {
    resultTitle = 'Тест пройден!';
    resultClass = 'bg-yellow-400';
  } else {
    resultTitle = 'Стоит повторить материал';
    resultClass = 'bg-red-500';
  }

  const handleGetCertificate = async () => {
    setIsGenerating(true);
    try {
      const url = await onDownloadCertificate(courseName);
      if (url) {
        // Открываем предпросмотр
        setPreviewUrl(url);
        setIsPreviewOpen(true);
      } else {
        // можно показывать toaster/уведомление об ошибке
        console.error('Не удалось получить сертификат');
      }
    } catch (err) {
      console.error('Ошибка при генерации сертификата', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    // Браузерный URL удаляем в родителе, но если нужно — можно revoke здесь:
    // URL.revokeObjectURL(previewUrl || '');
    // setPreviewUrl(null);
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

      <h3 className="text-2xl font-bold mb-2">{resultTitle}</h3>

      {userName ? (
        <p className="text-lg text-gray-700 mb-4">
          {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
        </p>
      ) : (
        <p className="text-gray-700 mb-4">
          Вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
        </p>
      )}

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`${resultClass} h-4 rounded-full transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Поздравляем, {userName || 'Участник'}! Вы можете получить именной сертификат, подтверждающий ваши знания.
          </p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
            onClick={handleGetCertificate}
            disabled={isGenerating}
          >
            <Award className="mr-2 w-5 h-5" />
            <span>{isGenerating ? 'Генерируем...' : 'Получить сертификат'}</span>
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-gray-600 mb-4">
          {isPassed
            ? 'Отличная работа! Продолжайте обучение, чтобы стать экспертом в нефтегазовой отрасли.'
            : 'Рекомендуем повторить материал курса и пройти тест ещё раз для закрепления знаний.'}
        </p>
        <button
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition"
          onClick={onClose}
        >
          Вернуться к курсам
        </button>
      </div>

      {/* === Модальное окно предпросмотра PDF === */}
      {isPreviewOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={handleClosePreview} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h4 className="text-lg font-medium">Предпросмотр сертификата</h4>
              <div className="flex gap-2">
                <a
                  href={previewUrl}
                  download={`Certificate_${courseName}.pdf`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded"
                >
                  Скачать
                </a>
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={handleClosePreview}
                  aria-label="Close preview"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="w-full h-[75vh]">
              {/* iframe для предпросмотра PDF */}
              <iframe
                src={previewUrl}
                title="PDF preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsComponent;
