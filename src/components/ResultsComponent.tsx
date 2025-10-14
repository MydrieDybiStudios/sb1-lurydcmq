// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";
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

      // === ФОН (градиент в фирменных тонах Роснефти) ===
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "#fffef5");
      gradient.addColorStop(1, "#fff9e5");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === РАМКА золотистая ===
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 50, false, true);

      // === ЗАГОЛОВОК ===
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 110px Arial";
      ctx.textAlign = "center";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 200);

      ctx.fillStyle = "#000";
      ctx.font = "600 60px Arial";
      ctx.fillText("о завершении курса", canvasWidth / 2, padding + 280);

      // === ИМЯ ===
      ctx.fillStyle = "#000";
      ctx.font = "bold 90px Arial";
      ctx.fillText(userName, canvasWidth / 2, padding + 460);

      // === КУРС ===
      ctx.font = "400 50px Arial";
      ctx.fillText(`успешно завершил(а) курс «${courseName}»`, canvasWidth / 2, padding + 550);

      // === РЕЗУЛЬТАТЫ ===
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 60px Arial";
      ctx.fillText("РЕЗУЛЬТАТЫ ТЕСТА", canvasWidth / 2, padding + 720);

      ctx.fillStyle = "#000";
      ctx.font = "400 48px Arial";
      ctx.fillText(`Правильных ответов: ${score} из ${total}`, canvasWidth / 2, padding + 800);
      ctx.fillText(`Ошибок: ${incorrect}`, canvasWidth / 2, padding + 860);
      ctx.fillText(`Успешность: ${percentage}%`, canvasWidth / 2, padding + 920);

      // === ПОДПИСЬ / ДАТА ===
      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 36px Arial";
      ctx.textAlign = "left";
      ctx.fillStyle = "#000";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvasHeight - padding - 160);

      // Подпись
      ctx.textAlign = "right";
      ctx.strokeStyle = "#1E3A8A";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvasWidth - padding - 420, canvasHeight - padding - 150);
      ctx.bezierCurveTo(canvasWidth - padding - 350, canvasHeight - padding - 180, canvasWidth - padding - 100, canvasHeight - padding - 80, canvasWidth - padding - 40, canvasHeight - padding - 120);
      ctx.stroke();

      ctx.fillStyle = "#1E3A8A";
      ctx.font = "italic 36px Arial";
      ctx.fillText("Р.И. Кузоваткин", canvasWidth - padding - 80, canvasHeight - padding - 80);

      ctx.fillStyle = "#000";
      ctx.font = "400 30px Arial";
      ctx.fillText("Подпись", canvasWidth - padding - 230, canvasHeight - padding - 40);

      // === ОРГАНИЗАЦИЯ ===
      ctx.textAlign = "center";
      ctx.fillStyle = "#444";
      ctx.font = "italic 36px Arial";
      ctx.fillText("Цифровая образовательная среда «Югра.Нефть»", canvasWidth / 2, canvasHeight - padding + 10);

      // === СОХРАНЕНИЕ PDF ===
      const pngBlob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 1));
      if (!pngBlob) throw new Error("Ошибка при создании изображения сертификата");

      const pdfDoc = await PDFDocument.create();
      const pngBytes = await pngBlob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(userName)}_${safeFileName(courseName)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
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

      {percentage >= 70 && (
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
        <button className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition" onClick={onClose}>
          Вернуться к курсам
        </button>
      </div>
    </div>
  );
};
export default ResultsComponent;

/* === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ === */
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
