// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, Award, X } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
  /**
   * Опционально можно передать имя пользователя извне.
   * Если не передано — компонент попытается прочитать имя из supabase.auth.getUser().
   */
  userName?: string;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose, userName: userNameProp }) => {
  const [userName, setUserName] = useState<string | null>(userNameProp ?? null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    // если имя пришло пропом — используем его
    if (userNameProp) {
      setUserName(userNameProp);
      return;
    }

    // иначе пробуем получить из supabase (метаданные аутентификации)
    const loadName = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        const nameFromMeta =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          (user?.email ? user.email.split("@")[0] : null);
        if (nameFromMeta) setUserName(nameFromMeta);
        else setUserName("Участник");
      } catch (err) {
        console.warn("Не удалось получить имя пользователя из Supabase:", err);
        setUserName("Участник");
      }
    };
    loadName();
  }, [userNameProp]);

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

  // Санация строк для имени/курса (для имени файла)
  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // === Основная функция генерации сертификата ===
  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    // Открываем пустое окно синхронно (чтобы не поймать popup-blocker)
    const previewWindow = window.open("", "_blank");

    try {
      // Создаём PDF
      const pdfDoc = await PDFDocument.create();
      // делаем A4 landscape для более красивого сертификата
      const page = pdfDoc.addPage([1122, 794]);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { width, height } = page.getSize();

      // Цвета
      const gold = rgb(0.82, 0.64, 0.12);
      const dark = rgb(0.08, 0.08, 0.08);

      // Фон рамки
      const padding = 36;
      page.drawRectangle({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
        borderColor: gold,
        borderWidth: 6,
        color: undefined,
      });

      // Заголовок
      const title = "СЕРТИФИКАТ О ЗАВЕРШЕНИИ КУРСА";
      const titleSize = 28;
      const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 140,
        size: titleSize,
        font: fontBold,
        color: gold,
      });

      // Имя
      const nameText = userName || "Участник";
      const nameSize = 24;
      const nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
      page.drawText(nameText, {
        x: (width - nameWidth) / 2,
        y: height - 200,
        size: nameSize,
        font: fontBold,
        color: dark,
      });

      // Текст о курсе
      const completedText = "успешно завершил(а) курс";
      const completedSize = 14;
      const completedWidth = fontNormal.widthOfTextAtSize(completedText, completedSize);
      page.drawText(completedText, {
        x: (width - completedWidth) / 2,
        y: height - 235,
        size: completedSize,
        font: fontNormal,
        color: dark,
      });

      const courseText = `«${courseName}»`;
      const courseSize = 18;
      const courseWidth = fontBold.widthOfTextAtSize(courseText, courseSize);
      page.drawText(courseText, {
        x: (width - courseWidth) / 2,
        y: height - 260,
        size: courseSize,
        font: fontBold,
        color: dark,
      });

      // Описание / примечание
      const desc = "Данный сертификат подтверждает знания, полученные в процессе обучения.";
      const descSize = 12;
      const descWidth = fontNormal.widthOfTextAtSize(desc, descSize);
      page.drawText(desc, {
        x: (width - descWidth) / 2,
        y: height - 300,
        size: descSize,
        font: fontNormal,
        color: rgb(0.25, 0.25, 0.25),
      });

      // Дата и подпись
      const date = new Date().toLocaleDateString("ru-RU");
      page.drawText(`Дата выдачи: ${date}`, {
        x: padding + 10,
        y: padding + 30,
        size: 12,
        font: fontNormal,
        color: rgb(0.35, 0.35, 0.35),
      });

      const org = 'Образовательная платформа "Югра.Нефть"';
      const orgSize = 12;
      const orgWidth = fontNormal.widthOfTextAtSize(org, orgSize);
      page.drawText(org, {
        x: width - padding - 10 - orgWidth,
        y: padding + 30,
        size: orgSize,
        font: fontNormal,
        color: rgb(0.35, 0.35, 0.35),
      });

      // Сохранение PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Если окно открылось — назначаем в него URL (синхронно открывали, теперь назначаем)
      if (previewWindow) {
        previewWindow.location.href = url;
      } else {
        // Если окно заблокировано — показываем внутри приложения
        setPreviewUrl(url);
        setIsPreviewOpen(true);
      }

      // Автоскачивание (создаём временную ссылку и кликаем)
      const cleanName = safeFileName(nameText);
      const cleanCourse = safeFileName(courseName);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${cleanName}_${cleanCourse}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Отложенный revoke (даём время на просмотр/скачивание)
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 120000);
    } catch (err) {
      console.error("Ошибка при генерации сертификата:", err);
      if (previewWindow) previewWindow.close();
      alert("Не удалось сгенерировать сертификат — смотрите консоль.");
    } finally {
      setIsGenerating(false);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }
    setPreviewUrl(null);
    setIsPreviewOpen(false);
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
        {userName}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
      </p>

      {/* Прогрессбар */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className={`${resultClass} h-4 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
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

      {/* Preview modal (fallback, если popup блокирован) */}
      {isPreviewOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closePreview} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h4 className="text-lg font-medium">Предпросмотр сертификата</h4>
              <div className="flex gap-2">
                <a href={previewUrl} download={`Сертификат_${safeFileName(userName || "Участник")}_${safeFileName(courseName)}.pdf`} className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded">
                  Скачать
                </a>
                <button onClick={closePreview} className="p-2 rounded hover:bg-gray-100"><X /></button>
              </div>
            </div>
            <div className="w-full h-[75vh]">
              <iframe src={previewUrl} title="PDF preview" className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsComponent;
