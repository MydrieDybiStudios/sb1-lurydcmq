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

  // === Загрузка имени пользователя из таблицы profiles ===
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
          const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(full || "Участник");
        }
      } catch {
        setUserName("Участник");
      }
    };
    loadProfileName();
  }, []);

  if (!results) return null;

  const { score, total, percentage } = results;
  const isPassed = percentage >= 50;

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // === Генерация PDF сертификата ===
  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          if (full) setUserName(full);
        }
      }

      const canvasWidth = 2480;
      const canvasHeight = 1754;
      const padding = 120;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas не поддерживается");

      // === ФОН ===
      ctx.fillStyle = "#fffefc";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === РАМКА ===
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 35;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 40, false, true);

      // === ЗАГОЛОВОК ===
      ctx.textAlign = "center";
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 78px Arial";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 150);

      ctx.font = "bold 54px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText("о завершении курса", canvasWidth / 2, padding + 220);

      // === ИМЯ ===
      ctx.fillStyle = "#111";
      ctx.font = "bold 80px Arial";
      ctx.fillText(userName, canvasWidth / 2, padding + 400);

      // === ОПИСАНИЕ ===
      ctx.font = "400 42px Arial";
      ctx.fillStyle = "#333";
      wrapTextCentered(ctx, `успешно завершил(а) курс «${courseName}»`, canvasWidth / 2, padding + 480, canvasWidth - 400, 50);

      // === РЕЗУЛЬТАТ ===
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "#D4AF37";
      ctx.fillText("Результаты:", canvasWidth / 2, padding + 650);

      ctx.font = "400 36px Arial";
      ctx.fillStyle = "#111";
      ctx.fillText(`Правильных ответов: ${score} из ${total}`, canvasWidth / 2, padding + 720);
      ctx.fillText(`Успешность: ${percentage}%`, canvasWidth / 2, padding + 780);

      // === НИЖНЯЯ ПОЛОСА (цвета Роснефти) ===
      const barY = canvasHeight - 250;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, barY, canvasWidth, 80);
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(0, barY + 80, canvasWidth, 20);
      ctx.fillStyle = "#FFB300";
      ctx.fillRect(0, barY + 100, canvasWidth, 20);

      // === ТЕКСТ СНИЗУ ===
      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 30px Arial";
      ctx.fillStyle = "#333";
      ctx.textAlign = "left";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvasHeight - padding - 80);

      ctx.textAlign = "right";
      ctx.fillText("Образовательная платформа Yugra.Neft", canvasWidth - padding - 40, canvasHeight - padding - 80);

      // === ПОДПИСЬ (имитация ручки) ===
      const sigX = canvasWidth / 2 + 400;
      const sigY = canvasHeight - 280;
      ctx.strokeStyle = "#1E3A8A"; // тёмно-синяя ручка
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sigX, sigY);
      ctx.bezierCurveTo(sigX + 40, sigY - 20, sigX + 120, sigY + 10, sigX + 220, sigY - 30);
      ctx.bezierCurveTo(sigX + 300, sigY - 50, sigX + 380, sigY, sigX + 420, sigY - 20);
      ctx.stroke();

      ctx.font = "italic 28px Arial";
      ctx.fillStyle = "#1E3A8A";
      ctx.textAlign = "center";
      ctx.fillText("_____________________", sigX + 210, sigY + 40);
      ctx.fillText("Подпись", sigX + 210, sigY + 80);

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

      <h3 className="text-3xl font-bold mb-4">
        {percentage >= 90
          ? "Превосходный результат!"
          : percentage >= 70
          ? "Хороший результат!"
          : isPassed
          ? "Тест пройден!"
          : "Стоит повторить материал"}
      </h3>

      <p className="text-xl text-gray-800 mb-4">
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}».
      </p>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-5 mb-2">
          <div
            className={`${isPassed ? "bg-yellow-500" : "bg-red-500"} h-5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-base text-gray-600">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4">Поздравляем, {userName}! Вы можете скачать именной сертификат.</p>
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-medium py-3 px-8 rounded-lg transition flex items-center mx-auto"
          >
            <Award className="mr-2 w-5 h-5" />
            <span>{isGenerating ? "Генерация..." : "Скачать сертификат"}</span>
          </button>
        </div>
      )}

      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-gray-700 mb-4">
          {isPassed ? "Отличная работа! Продолжайте обучение." : "Попробуйте ещё раз и улучшите результат."}
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
