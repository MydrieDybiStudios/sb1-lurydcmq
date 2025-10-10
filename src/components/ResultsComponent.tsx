import React from 'react';
import { CheckCircle, Award, Download } from 'lucide-react';

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
  onDownloadCertificate: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ 
  results, 
  courseName,
  onClose,
  onDownloadCertificate
}) => {
  if (!results) return null;
  
  const { score, total, percentage } = results;
  
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
  
  const isPassed = percentage >= 50;

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
      
      <h3 className="text-2xl font-bold mb-4">{resultTitle}</h3>
      <p className="text-gray-700 mb-6">
        Вы ответили правильно на {score} из {total} вопросов по курсу "{courseName}"
      </p>
      
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
            Поздравляем с успешным прохождением курса! Вы можете получить именной сертификат, подтверждающий ваши знания.
          </p>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
            onClick={onDownloadCertificate}
          >
            <Award className="mr-2 w-5 h-5" />
            <span>Получить сертификат</span>
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
    </div>
  );
};

export default ResultsComponent;