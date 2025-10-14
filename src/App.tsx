import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import AuthModals from "./components/AuthModals";
import CourseModal from "./components/CourseModal";
import Profile from "./pages/Profile";
import Cabinet from "./pages/Cabinet";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import Partners from "./pages/Partners";
import coursesData from "./data/coursesData";
import { Course } from "./types/course";

function App() {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false); 

  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find((course) => course.id === courseId);
    if (course) {
      setCurrentCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  const handleLogin = () => setIsLoginModalOpen(true);
  const handleRegister = () => setIsRegisterModalOpen(true);

  const handleAuthSuccess = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Header
                onLogin={handleLogin}
                onRegister={handleRegister}
              />

              <HeroSection />
              <AboutSection />
              <TestimonialsSection />
              <CtaSection onLogin={handleLogin} onRegister={handleRegister} />

              <Footer />

              <AuthModals
                isLoginOpen={isLoginModalOpen}
                isRegisterOpen={isRegisterModalOpen}
                onCloseLogin={() => setIsLoginModalOpen(false)}
                onCloseRegister={() => setIsRegisterModalOpen(false)}
                onSwitchToLogin={() => {
                  setIsRegisterModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                onSwitchToRegister={() => {
                  setIsLoginModalOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                onAuthSuccess={handleAuthSuccess}
              />

              <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={currentCourse}
              />
            </div>
          }
        />

        {/* Профиль */}
        <Route path="/profile" element={<Profile />} />

        {/* Личный кабинет */}
        <Route path="/cabinet" element={<Cabinet />} />

        {/* О проекте */}
        <Route path="/about" element={<About />} />

        {/* Как работает сайт */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />

        {/* Партнёры */}
        <Route path="/partners" element={<Partners />} />

        {/* Политика конфиденциальности */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Условия использования */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </Router>
  );
}

export default App;
