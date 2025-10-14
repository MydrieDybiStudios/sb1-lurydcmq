import React, { useState } from "react";
import { CheckCircle, Award } from "lucide-react";
import { PDFDocument } from "pdf-lib";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName] = useState("Участник"); // Без загрузки из БД, просто Участник

  if (!results) return null;

  const { score, total, percentage } = results;
  const isPassed = percentage >= 50;

  let resultTitle = "";
  let resultClass = "";

  if (percentage >= 90) {
    resultTitle = "Превосходный результат!";
    resultClass = "bg-green-500";
  } else if (percentage >= 70) {
    resultTitle = "Хороший результат!";
    resultClass = "bg-yellow-500";
  } else if (percentage >= 50) {
    resultTitle = "Тест пройден!";
    resultClass = "bg-yellow-400";
  } else {
    resultTitle = "Стоит повторить материал";
    resultClass = "bg-red-500";
  }

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // Генерация красивого сертификата
  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    try {
      const canvasWidth = 2480; // A4 landscape
      const canvasHeight = 1754;
      const padding = 120;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas не поддерживается");

      // === ФОН ===
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "#fffefc");
      gradient.addColorStop(1, "#f5f2e8");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === ВНЕШНЯЯ РАМКА ===
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 40, false, true);

      // === ВНУТРЕННЯЯ РАМКА (золотистая) ===
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 12;
      roundRect(ctx, padding, padding, canvasWidth - padding * 2, canvasHeight - padding * 2, 25, false, true);

      // === ЗАГОЛОВОК ===
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.font = "bold 72px Arial, Helvetica, sans-serif";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 150);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 48px Arial, Helvetica, sans-serif";
      ctx.fillText("О ЗАВЕРШЕНИИ КУРСА", canvasWidth / 2, padding + 220);

      // === ИМЯ ===
      ctx.fillStyle = "#111111";
      ctx.font = "bold 64px Arial, Helvetica, sans-serif";
      ctx.fillText(userName, canvasWidth / 2, padding + 400);

      // === КУРС ===
      ctx.font = "400 40px Arial, Helvetica, sans-serif";
      const courseLine = `успешно завершил(а) курс «${courseName}»`;
      ctx.fillStyle = "#333333";
      wrapTextCentered(ctx, courseLine, canvasWidth / 2, padding + 470, canvasWidth - padding * 4, 50);

      // === ДЕКОРАТИВНАЯ ПОЛОСА ===
      ctx.fillStyle = "#000000";
      ctx.fillRect(padding * 2, padding + 550, canvasWidth - padding * 4, 6);
      ctx.fillStyle = "#D4AF37";
      ctx.fillRect(padding * 2, padding + 556, canvasWidth - padding * 4, 6);

      // === ДАТА И ОРГАНИЗАЦИЯ ===
      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 30px Arial, Helvetica, sans-serif";
      ctx.fillStyle = "#333333";
      ctx.textAlign = "left";
      ctx.fillText(`Дата: ${dateStr}`, padding + 50, canvasHeight - padding - 50);

      ctx.textAlign = "right";
      ctx.fillText("Образовательная платформа «Югра.Нефть»", canvasWidth - padding - 50, canvasHeight - padding - 50);

      // === ЭМБЛЕМА / СИМВОЛ (имитация лого) ===
      ctx.save();
      ctx.translate(canvasWidth / 2, padding + 280);
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(20, 0);
      ctx.lineTo(-20, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // === КОНВЕРТАЦИЯ В PDF ===
      const pngBlob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 1));
      if (!pngBlob) throw new Error("Ошибка при создании изображения");

      const pdfDoc = await PDFDocument.create();
      const pngBytes = await pngBlob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(userName)}_${safeFileName(courseName)}.pdf`;
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err: any) {
      console.error(err);
      alert("Ошибка при генерации сертификата: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div
          className={`${isPassed ? "bg-green-100" : "bg-red-100"} rounded-full w-20 h-20 flex items-center justify-center`}
        >
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
          <p className="text-gray-700 mb-4">
            Поздравляем, {userName}! Вы можете получить именной сертификат.
          </p>
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
          {isPassed
            ? "Отличная работа! Продолжайте обучение."
            : "Рекомендуем повторить материал и пройти тест снова."}
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

/* ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======= */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill = false,
  stroke = true
) {
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

function wrapTextCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const test = current ? current + " " + word : word;
    const w = ctx.measureText(test).width;
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], centerX, startY + i * lineHeight);
  }
}
