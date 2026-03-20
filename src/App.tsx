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
import UniversitiesPage from "./pages/UniversitiesPage";
import CareerTestPage from "./pages/CareerTestPage";
import SimulatorsPage from "./pages/SimulatorsPage";
import MapPage from './pages/MapPage';
import GlossaryPage from './pages/GlossaryPage';
import ArticlesPage from './pages/ArticlesPage';
import BooksPage from './pages/BooksPage';
import GigaChatBot from "./components/GigaChatBot"; // <-- Импортируем компонент
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
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
          {/* Все ваши маршруты остаются без изменений */}
          <Route
            path="/"
            element={
              <MainPage 
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/ar-module" element={<ARModule />} />
          <Route path="/vr-module" element={<VRModule />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/career-test" element={<CareerTestPage />} />
          <Route path="/simulators" element={<SimulatorsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
        </Routes>

        {/* Модальные окна */}
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

        {/* Добавляем GigaChat помощника */}
        <GigaChatBot />
      </div>
    </Router>
  );
}

export default App;
