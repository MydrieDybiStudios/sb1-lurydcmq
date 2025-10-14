// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { Award, CheckCircle, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  courseId: number; // Добавьте courseId
  onClose: () => void;
  onRestart: () => void; // Добавьте onRestart
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ 
  results, 
  courseName, 
  courseId,
  onClose, 
  onRestart 
}) => {
  const [userName, setUserName] = useState<string>("Участник");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  useEffect(() => {
    const loadProfileAndCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Загрузка профиля пользователя
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(fullName || "Участник");
        }

        // Проверка, пройден ли курс
        if (results && results.percentage >= 70) {
          const { data: completion } = await supabase
            .from("completed_courses")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

          setIsCourseCompleted(!!completion);
        }
      } catch {
        setUserName("Участник");
      }
    };
    loadProfileAndCompletion();
  }, [results, courseId]);

  // Функция для сохранения пройденного курса
  const saveCourseCompletion = async () => {
    if (!results || results.percentage < 70) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("completed_courses")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          course_name: courseName,
          score: results.score,
          total: results.total,
          percentage: results.percentage
        }, {
          onConflict: 'user_id,course_id'
        });

      if (error) throw error;
      setIsCourseCompleted(true);
    } catch (error) {
      console.error("Ошибка сохранения курса:", error);
    }
  };

  // Сохраняем курс при успешном прохождении
  useEffect(() => {
    if (results && results.percentage >= 70 && !isCourseCompleted) {
      saveCourseCompletion();
    }
  }, [results, isCourseCompleted]);

  // Функция проверки прав на сертификат
  const checkCertificateEligibility = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: completion } = await supabase
        .from("completed_courses")
        .select("id, percentage")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      return !!completion && completion.percentage >= 70;
    } catch {
      return false;
    }
  };

  const handleDownloadCertificate = async () => {
    // Проверяем право на сертификат
    const isEligible = await checkCertificateEligibility();
    if (!isEligible) {
      alert("Для получения сертификата необходимо успешно пройти курс с результатом не менее 70%");
      return;
    }

    setIsGenerating(true);
    try {
      const canvasWidth = 2480;
      const canvasHeight = 1754;
      const padding = 120;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas не поддерживается");

      // ... (весь ваш существующий код генерации PDF) ...
      // Оставьте без изменений всю функцию генерации сертификата

    } catch (err: any) {
      console.error("Ошибка генерации сертификата:", err);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!results) return null;

  const { score, total, percentage } = results;
  const incorrect = total - score;
  const isPassed = percentage >= 50;

  const resultTitle = isPassed ? "Поздравляем!" : "Попробуйте снова!";
  const resultClass = isPassed ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`${isPassed ? "bg-yellow-100" : "bg-red-100"} rounded-full w-20 h-20 flex items-center justify-center`}>
          {isPassed ? (
            <CheckCircle className={`${percentage >= 90 ? "text-yellow-600" : "text-yellow-500"} w-10 h-10`} />
          ) : (
            <div className="text-red-600 text-3xl">!</div>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">{resultTitle}</h3>
      <p className="text-lg text-gray-700 mb-4">
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}».
      </p>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className={`${resultClass} h-4 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-sm text-gray-600">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && isCourseCompleted && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4">Поздравляем, {userName}! Вы можете получить именной сертификат.</p>
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-medium py-2 px-6 rounded-lg transition flex items-center mx-auto"
          >
            <Award className="mr-2 w-5 h-5" />
            <span>{isGenerating ? "Генерация..." : "Получить сертификат"}</span>
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-gray-600 mb-4">
          {isPassed ? "Отличная работа! Продолжайте обучение." : "Рекомендуем повторить материал и пройти тест снова."}
        </p>
        
        <div className="flex justify-center space-x-4">
          <button 
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition" 
            onClick={onRestart}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти снова</span>
          </button>
          <button 
            className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition" 
            onClick={onClose}
          >
            Вернуться к курсам
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;

// Вспомогательная функция (оставьте без изменений)
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill = false, stroke = true) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
