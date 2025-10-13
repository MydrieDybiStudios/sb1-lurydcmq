// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, Award, X } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
  /**
   * Опционально можно передать userName из родителя,
   * но компонент всё равно запросит свежие данные при генерации.
   */
  userName?: string;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose, userName: userNameProp }) => {
  const [userName, setUserName] = useState<string | null>(userNameProp ?? null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Инициализация имени (показ в UI). Обновления будут проверяться при генерации.
  useEffect(() => {
    if (userNameProp) {
      setUserName(userNameProp);
      return;
    }
    const loadName = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user;
        const name = u?.user_metadata?.full_name || u?.user_metadata?.name || (u?.email ? u.email.split("@")[0] : null);
        setUserName(name ?? "Участник");
      } catch (err) {
        console.warn("Не удалось получить имя:", err);
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

  const safeFileName = (s: string) =>
    s ? s.replace(/[^a-zA-Z0-9\u0400-\u04FF\s\-_,.()]/g, "").replace(/\s+/g, "_") : "unknown";

  // Попытка найти и загрузить доступный TTF шрифт из public/fonts
  const findFontBytes = async (): Promise<ArrayBuffer | null> => {
    const candidates = [
      "/fonts/Roboto-Regular.ttf",
      "/fonts/Roboto-Bold.ttf",
      "/fonts/DejaVuSans.ttf",
      "/fonts/DejaVuSans-Bold.ttf",
      "/fonts/Inter-Regular.ttf",
    ];
    for (const path of candidates) {
      try {
        const resp = await fetch(path, { cache: "no-store" });
        if (!resp.ok) continue;
        const ab = await resp.arrayBuffer();
        console.info("Загружен шрифт:", path);
        return ab;
      } catch (err) {
        // пробуем следующий
      }
    }
    return null;
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

  const handleDownloadCertificate = async () => {
    setIsGenerating(true);

    // Открываем пустое окно синхронно (чтобы не поймать popup-blocker)
    const popup = window.open("", "_blank");

    try {
      // ПЕРЕЗАГРУЖАЕМ пользовательские данные, чтобы взять самое новое имя
      let latestName: string | null = null;
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user;
        latestName = u?.user_metadata?.full_name || u?.user_metadata?.name || (u?.email ? u.email.split("@")[0] : null);
        if (latestName) setUserName(latestName);
      } catch (err) {
        console.warn("Не удалось получить свежие данные пользователя:", err);
      }

      const nameForPdf = latestName || userName || "Участник";

      // Загружаем шрифт из public/fonts (обязательно положи TTF в public/fonts)
      const fontBytes = await findFontBytes();
      if (!fontBytes) {
        throw new Error(
          "Не найден TTF-шрифт в public/fonts. Положите, например, Roboto-Regular.ttf в public/fonts и попробуйте снова."
        );
      }

      const pdfDoc = await PDFDocument.create();
      const embeddedFont = await pdfDoc.embedFont(fontBytes);
      const page = pdfDoc.addPage([1122, 794]); // A4-ish landscape
      const { width, height } = page.getSize();

      const gold = rgb(0.82, 0.64, 0.12);
      const dark = rgb(0.08, 0.08, 0.08);
      const padding = 36;

      page.drawRectangle({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
        borderColor: gold,
        borderWidth: 6,
      });

      // Title
      const title = "СЕРТИФИКАТ О ЗАВЕРШЕНИИ КУРСА";
      const titleSize = 28;
      const titleWidth = embeddedFont.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 140,
        size: titleSize,
        font: embeddedFont,
        color: gold,
      });

      // Name
      const nameSize = 26;
      const nameWidth = embeddedFont.widthOfTextAtSize(nameForPdf, nameSize);
      page.drawText(nameForPdf, {
        x: (width - nameWidth) / 2,
        y: height - 200,
        size: nameSize,
        font: embeddedFont,
        color: dark,
      });

      // Course line
      const courseInfo = `успешно завершил(а) курс «${courseName}»`;
      const courseSize = 16;
      const courseWidth = embeddedFont.widthOfTextAtSize(courseInfo, courseSize);
      page.drawText(courseInfo, {
        x: (width - courseWidth) / 2,
        y: height - 240,
        size: courseSize,
        font: embeddedFont,
        color: dark,
      });

      // Date & org
      const date = new Date().toLocaleDateString("ru-RU");
      page.drawText(`Дата выдачи: ${date}`, {
        x: padding + 10,
        y: padding + 30,
        size: 12,
        font: embeddedFont,
        color: rgb(0.35, 0.35, 0.35),
      });

      const org = 'Образовательная платформа "Югра.Нефть"';
      const orgSize = 12;
      const orgWidth = embeddedFont.widthOfTextAtSize(org, orgSize);
      page.drawText(org, {
        x: width - padding - 10 - orgWidth,
        y: padding + 30,
        size: orgSize,
        font: embeddedFont,
        color: rgb(0.35, 0.35, 0.35),
      });

      // Сохраняем PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Если окно открылось (не заблокировано) — назначаем URL
      if (popup) {
        try {
          popup.location.href = url;
        } catch (err) {
          // некоторый браузеры могут мешать, но обычно ok
          popup.document.write(
            `<html><body style="margin:0"><iframe src="${url}" style="border:0;width:100vw;height:100vh"></iframe></body></html>`
          );
        }
      } else {
        // fallback — показываем modal preview внутри приложения
        setPreviewUrl(url);
        setIsPreviewOpen(true);
      }

      // Автоскачивание
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(nameForPdf)}_${safeFileName(courseName)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // revoke позже
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 120000);
    } catch (err: any) {
      console.error("Ошибка при генерации сертификата:", err);
      alert(err?.message ? `Ошибка: ${err.message}` : "Не удалось сгенерировать сертификат — смотрите консоль.");
      // если popup открылся — закрываем его
      try {
        // @ts-ignore
        if (popup && !popup.closed) popup.close();
      } catch {}
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
        {userName || "Участник"}, вы ответили правильно на {score} из {total} вопросов по курсу «{courseName}»
      </p>

      {/* Прогрессбар */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className={`${resultClass} h-4 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-sm text-gray-600">{percentage}% правильных ответов</p>
      </div>

      {percentage >= 70 && (
        <div className="mb-8">
          <p className="text-gray-700 mb-4">Поздравляем, {userName || "Участник"}! Вы можете получить именной сертификат.</p>
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

      {/* Preview modal (fallback) */}
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
