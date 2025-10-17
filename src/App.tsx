import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthModals from "./components/AuthModals";
import CourseModal from "./components/CourseModal";
import Profile from "./pages/Profile";
import Cabinet from "./pages/Cabinet";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MainPage from "./pages/MainPage";
import ReviewsPage from "./pages/ReviewsPage";
import ARModule from "./pages/ARModule";
import VRModule from "./pages/VRModule";
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
      <div className="App">
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <MainPage 
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            }
          />

          {/* Профиль */}
          <Route path="/profile" element={<Profile />} />

          {/* Личный кабинет */}
          <Route path="/cabinet" element={<Cabinet />} />

          {/* Страница отзывов */}
          <Route path="/reviews" element={<ReviewsPage />} />

          {/* Новые страницы */}
          <Route path="/ar-module" element={<ARModule />} />
          <Route path="/vr-module" element={<VRModule />} />

          {/* Политика конфиденциальности */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Условия использования */}
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>

        {/* Модальные окна - рендерятся поверх всех страниц */}
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
    </Router>
  );
}

export default App;
