// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { Award, CheckCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void; // вызывается при возврате к курсам
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const [userName, setUserName] = useState<string>("Участник");
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);

  // Загрузка имени пользователя (можно подставить реальное из профиля)
  useEffect(() => {
    // Заглушка для имени пользователя, можно заменить на API вызов
    setUserName("Иван Иванов");
  }, []);

  if (!results) return null;

  const { score, total, percentage } = results;
  const incorrect = total - score;
  const isPassed = percentage >= 50;

  const resultTitle = isPassed ? "Поздравляем!" : "Попробуйте снова!";
  const resultClass = isPassed ? "bg-yellow-500" : "bg-red-500";

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // === Генерация сертификата ===
  const handleDownloadCertificate = async () => {
    if (certificateIssued) {
      alert("Сертификат уже был выдан. Чтобы получить новый, пройдите курс заново.");
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

      // === ФОН ===
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "#fffef5");
      gradient.addColorStop(1, "#fff9e5");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === РАМКА ===
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 50, false, true);

      // === ТЕКСТ ===
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 110px Arial";
      ctx.textAlign = "center";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 200);

      ctx.fillStyle = "#000";
      ctx.font = "bold 90px Arial";
      ctx.fillText(userName, canvasWidth / 2, padding + 460);

      ctx.font = "400 50px Arial";
      ctx.fillText(`успешно завершил(а) курс «${courseName}»`, canvasWidth / 2, padding + 550);

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

      setCertificateIssued(true); // сертификат выдан
    } catch (err: any) {
      console.error("Ошибка генерации сертификата:", err);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // === Сброс прогресса курса ===
  const handleResetProgress = () => {
    setCertificateIssued(false); // сброс сертификата
    onClose(); // возвращаемся к курсам
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`${isPassed ? "bg-yellow-100" : "bg-red-100"} rounded-full w-20 h-20 flex items-center justify-center`}>
          {isPassed ? <CheckCircle className="w-10 h-10 text-yellow-500" /> : <div className="text-red-600 text-3xl">!</div>}
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

      {percentage >= 70 && !certificateIssued && (
        <div className="mb-8">
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
        <button
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition"
          onClick={handleResetProgress}
        >
          Вернуться к курсам / Пройти заново
        </button>
      </div>
    </div>
  );
};

export default ResultsComponent;

// === Вспомогательная функция ===
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
