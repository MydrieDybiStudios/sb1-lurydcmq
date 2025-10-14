// src/components/ResultsComponent.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, Award, X } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "../lib/supabaseClient";

interface ResultsComponentProps {
  results: { score: number; total: number; percentage: number } | null;
  courseName: string;
  onClose: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, courseName, onClose }) => {
  const [userName, setUserName] = useState<string>("Участник");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadProfileName = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          setUserName(fullName || "Участник");
        } else {
          setUserName(user.email?.split("@")[0] || "Участник");
        }
      } catch (err) {
        console.warn("Ошибка при загрузке профиля:", err);
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

  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage([1122, 794]); // A4 landscape
      const { width, height } = page.getSize();

      const gold = rgb(0.82, 0.64, 0.12);
      const dark = rgb(0.1, 0.1, 0.1);

      page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        borderColor: gold,
        borderWidth: 6,
      });

      const title = "СЕРТИФИКАТ О ЗАВЕРШЕНИИ КУРСА";
      const titleSize = 28;
      const titleWidth = font.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 140,
        size: titleSize,
        font,
        color: gold,
      });

      const nameSize = 26;
      const nameWidth = font.widthOfTextAtSize(userName, nameSize);
      page.drawText(userName, {
        x: (width - nameWidth) / 2,
        y: height - 200,
        size: nameSize,
        font,
        color: dark,
      });

      const courseLine = `успешно завершил(а) курс «${courseName}»`;
      const courseWidth = font.widthOfTextAtSize(courseLine, 16);
      page.drawText(courseLine, {
        x: (width - courseWidth) / 2,
        y: height - 240,
        size: 16,
        font,
        color: dark,
      });

      const date = new Date().toLocaleDateString("ru-RU");
      page.drawText(`Дата выдачи: ${date}`, {
        x: 60,
        y: 70,
        size: 12,
        font,
        color: rgb(0.35, 0.35, 0.35),
      });

      const org = 'Образовательная платформа "Югра.Нефть"';
      const orgWidth = font.widthOfTextAtSize(org, 12);
      page.drawText(org, {
        x: width - 60 - orgWidth,
        y: 70,
        size: 12,
        font,
        color: rgb(0.35, 0.35, 0.35),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Сертификат_${safeFileName(userName)}_${safeFileName(courseName)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка генерации сертификата:", err);
      alert("Ошибка при создании PDF. Подробности — в консоли.");
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
