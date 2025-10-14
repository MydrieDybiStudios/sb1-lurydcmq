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

  // Загружаем актуальное имя из таблицы profiles (first_name + last_name)
  useEffect(() => {
    const loadProfileName = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setUserName("Участник");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(full || user.email?.split("@")[0] || "Участник");
        } else {
          setUserName(user.email?.split("@")[0] || "Участник");
        }
      } catch (err) {
        console.warn("Не удалось загрузить профиль:", err);
        setUserName("Участник");
      }
    };

    loadProfileName();
  }, []);

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

  // Генерация сертификата: рисуем на canvas (поддерживается кириллица), затем встраиваем PNG в PDF (pdf-lib)
  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    try {
      // Обновим имя из профиля перед генерацией (на всякий случай)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
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
      } catch (err) {
        console.warn("Не удалось обновить имя перед генерацией:", err);
      }

      // Параметры canvas (A4-like landscape for good quality)
      const canvasWidth = 2480; // ~A4 300dpi width landscape
      const canvasHeight = 1754; // ~A4 300dpi height
      const padding = 120;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas не поддерживается в этом окружении");

      // Фон
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Рамка — толстая золотая
      ctx.strokeStyle = "#D4AF37"; // золотой
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 30, false, true);

      // Внутренняя тонкая рамка
      ctx.strokeStyle = "#E6C87E";
      ctx.lineWidth = 8;
      roundRect(ctx, padding, padding, canvasWidth - padding * 2, canvasHeight - padding * 2, 20, false, true);

      // Заголовок
      ctx.fillStyle = "#333333";
      ctx.font = "bold 72px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#D4AF37";
      ctx.fillText("СЕРТИФИКАТ О ЗАВЕРШЕНИИ КУРСА", canvasWidth / 2, padding + 140);

      // Имя
      ctx.fillStyle = "#111111";
      ctx.font = "bold 64px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(userName, canvasWidth / 2, padding + 300);

      // Курс
      ctx.font = "400 40px Arial, Helvetica, sans-serif";
      const courseLine = `успешно завершил(а) курс «${courseName}»`;
      ctx.fillStyle = "#111111";
      wrapTextCentered(ctx, courseLine, canvasWidth / 2, padding + 360, canvasWidth - padding * 4, 42);

      // Дата и подпись
      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 28px Arial, Helvetica, sans-serif";
      ctx.fillStyle = "#555555";
      ctx.textAlign = "left";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvasHeight - padding - 40);

      const org = 'Образовательная платформа "Югра.Нефть"';
      ctx.textAlign = "right";
      ctx.fillText(org, canvasWidth - padding - 40, canvasHeight - padding - 40);

      // Небольшой декоративный элемент (полоса снизу)
      ctx.fillStyle = "#111111";
      ctx.fillRect(padding + 40, canvasHeight - padding - 100, canvasWidth - padding * 2 - 80, 6);

      // Конвертируем canvas -> blob (PNG)
      const pngBlob: Blob | null = await new Promise((res) =>
        canvas.toBlob((b) => res(b), "image/png", 1)
      );

      if (!pngBlob) throw new Error("Не удалось создать изображение сертификата");

      // Вставляем PNG в PDF (pdf-lib) — не нужен fontkit
      const pdfDoc = await PDFDocument.create();
      const pngBytes = await pngBlob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(pngBytes);

      // Создаём страницу под размер изображения
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });

      const pdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Скачивание
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(userName)}_${safeFileName(courseName)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Очистка
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 60_000);
    } catch (err: any) {
      console.error("Ошибка при генерации сертификата:", err);
      alert(err?.message ? `Ошибка: ${err.message}` : "Не удалось сгенерировать сертификат — см. консоль.");
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

/* ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======= */
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

// Центрированный перенос текста по ширине (wrap)
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
