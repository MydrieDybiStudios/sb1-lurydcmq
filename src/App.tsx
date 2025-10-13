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
import Cabinet from "./pages/Cabinet"; // 👈 новая страница личного кабинета
import coursesData from "./data/coursesData";
import { Course } from "./types/course";
import Cabinet from "./pages/Cabinet";

function App() {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 имитация авторизации

  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find((course) => course.id === courseId);
    if (course) {
      setCurrentCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  const handleLogin = () => setIsLoginModalOpen(true);
  const handleRegister = () => setIsRegisterModalOpen(true);

  // При успешной авторизации
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
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
                isAuthenticated={isAuthenticated}
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
                onAuthSuccess={handleAuthSuccess} // 👈 вызывается после входа
              />

              <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={currentCourse}
              />
            </div>
          }
        />

        {/* Профиль (если был ранее) */}
        <Route path="/profile" element={<Profile />} />

        {/* Новый личный кабинет */}
        

<Route path="/cabinet" element={<Cabinet />} />

      </Routes>
    </Router>
  );
}

export default App;

