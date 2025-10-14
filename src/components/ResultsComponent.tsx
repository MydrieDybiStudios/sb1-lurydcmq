// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { Award, CheckCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const ResultsComponent: React.FC<{ results: { score: number; total: number; percentage: number } | null; courseName: string; }> = ({ results, courseName }) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Участник");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

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

  if (!results || isCleared) return null;

  const { score, total, percentage } = results;
  const incorrect = total - score;
  const isPassed = percentage >= 50;
  const resultTitle = isPassed ? "Поздравляем!" : "Попробуйте снова!";
  const resultClass = isPassed ? "bg-yellow-500" : "bg-red-500";

  useEffect(() => {
    if (percentage >= 70) {
      setIsCertificateAvailable(true);
      setIsCourseCompleted(true);
    }
  }, [percentage]);

  const safeFileName = (s: string) =>
    s
      ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_")
      : "unknown";

  // === Генерация сертификата ===
  const handleDownloadCertificate = async () => {
    if (!isCertificateAvailable) {
      alert("Чтобы получить сертификат, пройдите курс заново.");
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 2480;
      canvas.height = 1754;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas не поддерживается");

      const padding = 120;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#fffef5");
      gradient.addColorStop(1, "#fff9e5");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvas.width - padding, canvas.height - padding, 50, false, true);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 110px Arial";
      ctx.textAlign = "center";
      ctx.fillText("СЕРТИФИКАТ", canvas.width / 2, padding + 200);

      ctx.fillStyle = "#000";
      ctx.font = "600 60px Arial";
      ctx.fillText("о завершении курса", canvas.width / 2, padding + 280);

      ctx.font = "bold 90px Arial";
      ctx.fillText(userName, canvas.width / 2, padding + 460);

      ctx.font = "400 50px Arial";
      ctx.fillText(`успешно завершил(а) курс «${courseName}»`, canvas.width / 2, padding + 550);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 60px Arial";
      ctx.fillText("РЕЗУЛЬТАТЫ ТЕСТА", canvas.width / 2, padding + 720);

      ctx.fillStyle = "#000";
      ctx.font = "400 48px Arial";
      ctx.fillText(`Правильных ответов: ${score} из ${total}`, canvas.width / 2, padding + 800);
      ctx.fillText(`Ошибок: ${incorrect}`, canvas.width / 2, padding + 860);
      ctx.fillText(`Успешность: ${percentage}%`, canvas.width / 2, padding + 920);

      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 36px Arial";
      ctx.textAlign = "left";
      ctx.fillStyle = "#000";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvas.height - padding - 160);

      ctx.textAlign = "center";
      ctx.fillStyle = "#444";
      ctx.font = "italic 36px Arial";
      ctx.fillText("Цифровая образовательная среда «Югра.Нефть»", canvas.width / 2, canvas.height - padding + 10);

      const pngBlob: Blob | null = await new Promise((res) =>
        canvas.toBlob((b) => res(b), "image/png", 1)
      );
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

  // === Возврат к курсам с полным сбросом ===
  const handleReturnToCourses = () => {
    // сбрасываем всё состояние и локальное хранилище
    localStorage.removeItem("currentCourseResults");
    localStorage.removeItem("certificateGenerated");
    setIsCertificateAvailable(false);
    setIsCourseCompleted(false);
    setIsCleared(true);

    // мгновенный переход без перезагрузки
    navigate("/cabinet", { replace: true });
  };

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

      {isCertificateAvailable && isCourseCompleted && (
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
          {isPassed ? "Отличная работа! Продолжайте обучение." : "Рекомендуем повторить материал и пройти тест снова."}
        </p>
        <button
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition"
          onClick={handleReturnToCourses}
        >
          Вернуться к курсам
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
