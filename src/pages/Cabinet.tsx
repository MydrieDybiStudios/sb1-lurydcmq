// src/pages/Cabinet.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import AchievementsSection from "../components/AchievementsSection";
import CourseModal from "../components/CourseModal";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import coursesData from "../data/coursesData";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const Cabinet: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const navigate = useNavigate();

  // Хранение последнего созданного URL, чтобы можно было его revoke при перегенерации/закрытии
  const [lastCertificateUrl, setLastCertificateUrl] = useState<string | null>(null);

  // === Загрузка пользователя ===
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("first_name,last_name,avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (profData) setProfile(profData);
      }
    };

    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try {
        (sub as any)?.subscription?.unsubscribe?.();
        (sub as any)?.unsubscribe?.();
      } catch {}
      // Убираем последний URL при размонтировании
      if (lastCertificateUrl) {
        URL.revokeObjectURL(lastCertificateUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExitToMain = () => navigate("/");

  // === Открытие курса ===
  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  /**
   * Генерация сертификата PDF и возврат blob-URL для предпросмотра/скачивания.
   * Возвращает Promise<string | null>
   */
  const generateCertificateBlobUrl = async (courseTitle: string): Promise<string | null> => {
    try {
      // Имя пользователя
      const name = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim() || user?.user_metadata?.full_name || user?.email || "Участник";

      // Создаём PDF (страница A4 ориентир. но для встраивания в iframe можно взять 1122x794 ~ A4 landscape)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([1122, 794]); // landscape
      const { width, height } = page.getSize();

      // Встраиваем шрифты
      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Фон/рамка
      const gold = rgb(0.85, 0.66, 0.14);
      const darkGray = rgb(0.12, 0.12, 0.12);

      // Белая заливка
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 1, 1),
      });

      // Рамка - тонкая внешняя
      const outerPadding = 28;
      page.drawRectangle({
        x: outerPadding,
        y: outerPadding,
        width: width - outerPadding * 2,
        height: height - outerPadding * 2,
        borderColor: gold,
        borderWidth: 6,
        color: undefined,
      });

      // Внутренняя рамка
      page.drawRectangle({
        x: outerPadding + 14,
        y: outerPadding + 14,
        width: width - (outerPadding + 14) * 2,
        height: height - (outerPadding + 14) * 2,
        borderColor: rgb(0.95, 0.93, 0.9),
        borderWidth: 1.5,
      });

      // Логотип/заголовок слева
      const headerX = outerPadding + 36;
      page.drawText('Югра.Нефть', {
        x: headerX,
        y: height - 110,
        size: 28,
        font: fontBold,
        color: darkGray,
      });

      // Большой заголовок сертификата (по центру)
      const title = 'СЕРТИФИКАТ О ЗАВЕРШЕНИИ КУРСА';
      const titleSize = 28;
      const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 160,
        size: titleSize,
        font: fontBold,
        color: gold,
      });

      // Текст: имя
      const nameText = `${name}`;
      const nameSize = 26;
      const nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
      page.drawText(nameText, {
        x: (width - nameWidth) / 2,
        y: height - 240,
        size: nameSize,
        font: fontBold,
        color: darkGray,
      });

      // Подпись: что завершил
      const completedText = `успешно завершил(а) курс`;
      const completedSize = 14;
      const completedWidth = fontNormal.widthOfTextAtSize(completedText, completedSize);
      page.drawText(completedText, {
        x: (width - completedWidth) / 2,
        y: height - 270,
        size: completedSize,
        font: fontNormal,
        color: darkGray,
      });

      // Название курса
      const courseText = `"${courseTitle}"`;
      const courseSize = 18;
      const courseWidth = fontBold.widthOfTextAtSize(courseText, courseSize);
      page.drawText(courseText, {
        x: (width - courseWidth) / 2,
        y: height - 300,
        size: courseSize,
        font: fontBold,
        color: darkGray,
      });

      // Дополнительный текст / описание
      const description = `Вы продемонстрировали знания и навыки по темам курса.`;
      const descSize = 12;
      const descWidth = fontNormal.widthOfTextAtSize(description, descSize);
      page.drawText(description, {
        x: (width - descWidth) / 2,
        y: height - 340,
        size: descSize,
        font: fontNormal,
        color: rgb(0.25, 0.25, 0.25),
      });

      // Дата выдачи
      const date = new Date().toLocaleDateString('ru-RU');
      const dateText = `Дата выдачи: ${date}`;
      page.drawText(dateText, {
        x: outerPadding + 36,
        y: outerPadding + 40,
        size: 12,
        font: fontNormal,
        color: rgb(0.35, 0.35, 0.35),
      });

      // Подпись организации справа
      const orgText = `Образовательная платформа «Югра.Нефть»`;
      const orgSize = 12;
      const orgWidth = fontNormal.widthOfTextAtSize(orgText, orgSize);
      page.drawText(orgText, {
        x: width - outerPadding - 36 - orgWidth,
        y: outerPadding + 40,
        size: orgSize,
        font: fontNormal,
        color: rgb(0.35, 0.35, 0.35),
      });

      // Имитация печати: круглая печать справа
      const sealRadius = 60;
      const sealCenterX = width - outerPadding - 140;
      const sealCenterY = outerPadding + 120;

      // Нарисуем круг (контур) печати
      page.drawCircle({
        x: sealCenterX,
        y: sealCenterY,
        size: sealRadius,
        borderColor: gold,
        borderWidth: 4,
      });

      // Внутри печати — текст
      const sealText = 'Югра.Нефть';
      const sealSize = 10;
      const sealTextWidth = fontNormal.widthOfTextAtSize(sealText, sealSize);
      page.drawText(sealText, {
        x: sealCenterX - sealTextWidth / 2,
        y: sealCenterY - sealSize / 2,
        size: sealSize,
        font: fontNormal,
        color: gold,
      });

      // Сохранение PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Ревок предыдущего URL (чтобы не утекала память)
      if (lastCertificateUrl) {
        try { URL.revokeObjectURL(lastCertificateUrl); } catch {}
      }

      const blobUrl = URL.createObjectURL(blob);
      setLastCertificateUrl(blobUrl);

      return blobUrl;
    } catch (error) {
      console.error('Ошибка генерации сертификата:', error);
      return null;
    }
  };

  // Функция-обёртка для передачи в ResultsComponent
  const handleGenerateCertificate = async (courseTitle: string) => {
    return await generateCertificateBlobUrl(courseTitle);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка личного кабинета...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              UO
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Личный кабинет — Югра.Нефть</h1>
              <p className="text-xs text-gray-300 hidden md:block">Ваши курсы и достижения</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/profile" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-yellow-400">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-semibold">
                        {(profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-yellow-500 font-medium">
                    {profile?.first_name || user.email || "Пользователь"}
                  </span>
                </Link>

                <button
                  onClick={handleExitToMain}
                  className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
                >
                  Выйти в меню
                </button>
              </>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="menu"
            >
              <Menu className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {user ? (
          <>
            <section id="courses" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🎓 Мои курсы</h2>
              <CoursesSection onStartCourse={handleStartCourse} />
            </section>

            <section id="achievements">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🏆 Мои достижения</h2>
              <AchievementsSection />
            </section>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto p-10 text-center border border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Доступ ограничен 🚫</h2>
            <p className="text-gray-700 mb-6">
              Для того, чтобы получить доступ к курсам и сохранению результата,
              войдите или зарегистрируйтесь на сайте.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition"
              >
                Войти
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-600 font-semibold py-2 px-6 rounded-lg transition"
              >
                Регистрация
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* ===== Модальное окно курса ===== */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default Cabinet;
