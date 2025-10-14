// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, Award } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const [userName, setUserName] = useState<string>("Участник");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadProfileName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(fullName || "Участник");
        }
      } catch {
        setUserName("Участник");
      }
    };

    loadProfileName();
  }, []);

  if (!results) return null;

  const { score, total, percentage } = results;
  const incorrect = total - score;
  const isPassed = percentage >= 50;

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // === Генерация PDF сертификата ===
  const handleDownloadCertificate = async () => {
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

      // === ФОН ===
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === РАМКА ===
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 35;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 40, false, true);

      // === ТИТУЛ ===
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 90px Arial";
      ctx.textAlign = "center";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 150);

      ctx.fillStyle = "#000";
      ctx.font = "600 56px Arial";
      ctx.fillText("о завершении курса", canvasWidth / 2, padding + 230);

      // === ИМЯ ===
      ctx.fillStyle = "#000";
      ctx.font = "bold 80px Arial";
      ctx.fillText(userName, canvasWidth / 2, padding + 420);

      // === КУРС ===
      ctx.font = "400 46px Arial";
      ctx.fillText(`успешно завершил(а) курс «${courseName}»`, canvasWidth / 2, padding + 520);

      // === РЕЗУЛЬТАТЫ ===
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 52px Arial";
      ctx.fillText("РЕЗУЛЬТАТЫ ТЕСТА", canvasWidth / 2, padding + 720);

      ctx.fillStyle = "#000";
      ctx.font = "400 44px Arial";
      ctx.fillText(`Правильных ответов: ${score} из ${total}`, canvasWidth / 2, padding + 800);
      ctx.fillText(`Ошибок: ${incorrect}`, canvasWidth / 2, padding + 860);
      ctx.fillText(`Успешность: ${percentage}%`, canvasWidth / 2, padding + 920);

      // === ДАТА ===
      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 34px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvasHeight - padding - 120);

      // === ПОДПИСЬ (место для подписи) ===
      ctx.textAlign = "right";
      ctx.font = "400 34px Arial";
      ctx.fillText("__________________________", canvasWidth - padding - 40, canvasHeight - padding - 120);
      ctx.fillText("Подпись", canvasWidth - padding - 240, canvasHeight - padding - 70);

      // === PDF ===
      const pngBlob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 1));
      if (!pngBlob) throw new Error("Ошибка при создании изображения сертификата");

      const pdfDoc = await PDFDocument.create();
      const pngBytes = await pngBlob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });

      const pdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(userName)}_${safeFileName(courseName)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err: any) {
      console.error("Ошибка генерации сертификата:", err);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // === JSX ===
  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`${isPassed ? "bg-green-100" : "bg-red-100"} rounded-full w-20 h-20 flex items-center justify-center`}>
          {isPassed ? (
            <CheckCircle className={`${percentage >= 90 ? "text-green-600" : "text-yellow-600"} w-10 h-10`} />
          ) : (
            <div className="text-red-600 text-3xl">!</div>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">
        {percentage >= 90
          ? "Превосходный результат!"
          : percentage >= 70
          ? "Хороший результат!"
          : isPassed
          ? "Тест пройден!"
          : "Стоит повторить материал"}
      </h3>

      <p className="text-lg text-gray-700 mb-4">
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}».
      </p>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`${isPassed ? "bg-yellow-500" : "bg-red-500"} h-4 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-base text-gray-600 font-semibold">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4 font-medium">
            Поздравляем, {userName}! Вы можете скачать именной сертификат.
          </p>
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-medium py-3 px-8 rounded-lg transition flex items-center mx-auto text-lg"
          >
            <Award className="mr-2 w-6 h-6" />
            <span>{isGenerating ? "Генерация..." : "Скачать сертификат"}</span>
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-gray-600 mb-4 text-base">
          {isPassed ? "Отличная работа! Продолжайте обучение." : "Рекомендуем повторить материал и пройти тест снова."}
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

/* ======= ВСПОМОГАТЕЛЬНЫЕ ======= */
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
