// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { Award, CheckCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose?: () => void; // если родитель хочет услышать закрытие
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("Участник");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  // UI states for smooth transition + embedded fallback cabinet
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEmbeddedCabinet, setShowEmbeddedCabinet] = useState(false);

  // загрузка имени пользователя
  useEffect(() => {
    let mounted = true;
    const loadProfileName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();
        if (!mounted) return;
        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(fullName || "Участник");
        }
      } catch {
        if (mounted) setUserName("Участник");
      }
    };
    loadProfileName();
    return () => { mounted = false; };
  }, []);

  // если результатов нет — ничего не показываем (значит компонент не нужен)
  if (!results && !showEmbeddedCabinet) return null;

  const { score = 0, total = 0, percentage = 0 } = results || { score: 0, total: 0, percentage: 0 };
  const incorrect = total - score;
  const isPassed = percentage >= 50;

  const resultTitle = isPassed ? "Поздравляем!" : "Попробуйте снова!";
  const resultClass = isPassed ? "bg-yellow-500" : "bg-red-500";

  useEffect(() => {
    if (percentage >= 70) {
      setIsCertificateAvailable(true);
      setIsCourseCompleted(true);
    } else {
      setIsCertificateAvailable(false);
      setIsCourseCompleted(false);
    }
  }, [percentage]);

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // генерация PDF (без изменений логики)
  const handleDownloadCertificate = async () => {
    if (!isCertificateAvailable) {
      alert("Чтобы получить сертификат, пройдите курс заново.");
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

      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "#fffef5");
      gradient.addColorStop(1, "#fff9e5");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 40;
      roundRect(ctx, padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding, 50, false, true);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 110px Arial";
      ctx.textAlign = "center";
      ctx.fillText("СЕРТИФИКАТ", canvasWidth / 2, padding + 200);

      ctx.fillStyle = "#000";
      ctx.font = "600 60px Arial";
      ctx.fillText("о завершении курса", canvasWidth / 2, padding + 280);

      ctx.fillStyle = "#000";
      ctx.font = "bold 90px Arial";
      ctx.fillText(userName, canvasWidth / 2, padding + 460);

      ctx.font = "400 50px Arial";
      ctx.fillText(`успешно завершил(а) курс «${courseName}»`, canvasWidth / 2, padding + 550);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 60px Arial";
      ctx.fillText("РЕЗУЛЬТАТЫ ТЕСТА", canvasWidth / 2, padding + 720);

      ctx.fillStyle = "#000";
      ctx.font = "400 48px Arial";
      ctx.fillText(`Правильных ответов: ${score} из ${total}`, canvasWidth / 2, padding + 800);
      ctx.fillText(`Ошибок: ${incorrect}`, canvasWidth / 2, padding + 860);
      ctx.fillText(`Успешность: ${percentage}%`, canvasWidth / 2, padding + 920);

      const dateStr = new Date().toLocaleDateString("ru-RU");
      ctx.font = "400 36px Arial";
      ctx.textAlign = "left";
      ctx.fillStyle = "#000";
      ctx.fillText(`Дата выдачи: ${dateStr}`, padding + 40, canvasHeight - padding - 160);

      ctx.textAlign = "center";
      ctx.fillStyle = "#444";
      ctx.font = "italic 36px Arial";
      ctx.fillText("Цифровая образовательная среда «Югра.Нефть»", canvasWidth / 2, canvasHeight - padding + 10);

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
      // после успешной генерации пометить, что сертификат был сгенерирован (локально)
      // это же предотвратит повторное получение после перехода назад без прохождения
      try { localStorage.setItem("certificateGenerated", "1"); } catch {}
    }
  };

  // мягкий возврат: анимация -> навигация -> встроенный кабинет (fallback)
  const handleReturnToCourses = () => {
    if (isTransitioning) return; // защита от multiple clicks
    setIsTransitioning(true);

    // запускаем плавную анимацию (CSS класс ниже использует transition)
    // через короткую паузу выполняем реальный сброс и навигацию
    setTimeout(() => {
      // очистка локального состояния
      try {
        localStorage.removeItem("currentCourseResults");
        localStorage.removeItem("certificateGenerated");
      } catch {}
      setIsCertificateAvailable(false);
      setIsCourseCompleted(false);

      // пометим, что показываем встроенный кабинет (fallback), чтобы не получить белый экран
      setShowEmbeddedCabinet(true);

      // уведомляем родителя, если нужно (опционально)
      if (onClose) {
        try { onClose(); } catch {}

        // даём шанс родителю скрыть/переключить UI, но не ждем
      }

      // попытка навигации без перезагрузки
      try {
        navigate("/cabinet", { replace: true });
      } catch (e) {
        // если navigate упал — ничего страшного, у нас есть встроенный кабинет
        console.warn("navigate error:", e);
      } finally {
        // завершаем анимацию (встроенный кабинет видим)
        setIsTransitioning(false);
      }
    }, 260); // 260ms — короткая задержка для плавности (можно уменьшить)
  };

  // Если showEmbeddedCabinet включён — показываем минимальную панель кабинета
  // Это предотвращает белый экран в случаях, когда роут /cabinet не отрисовывается сразу.
  const EmbeddedCabinet: React.FC = () => (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold">Кабинет</h2>
        <p className="text-sm text-gray-600">Вы перешли в кабинет — прогресс этого курса был сброшен.</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => navigate("/cabinet", { replace: true })}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Открыть кабинет (полная страница)
        </button>

        <div className="p-4 border rounded">
          <p className="font-medium mb-2">Доступные курсы</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Курс A</li>
            <li>Курс B</li>
            <li>Курс C</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // визуальный wrapper с плавностью (fade out при переходе)
  const wrapperClass = `p-6 text-center transition-opacity duration-250 ${isTransitioning ? "opacity-0" : "opacity-100"}`;

  // Если показываем встроенный кабинет — рендерим его вместо результатов
  if (showEmbeddedCabinet) {
    return <EmbeddedCabinet />;
  }

  return (
    <div className={wrapperClass}>
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
