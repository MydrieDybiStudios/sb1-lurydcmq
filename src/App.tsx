import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CoursesSection from "./components/CoursesSection";
import AboutSection from "./components/AboutSection";
import AchievementsSection from "./components/AchievementsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import AuthModals from "./components/AuthModals";
import CourseModal from "./components/CourseModal";
import Profile from "./pages/Profile";
import coursesData from "./data/coursesData";

import { Course } from "./types/course"; // ✅ использовать общий тип

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Header onLogin={() => setIsLoginModalOpen(true)} onRegister={() => setIsRegisterModalOpen(true)} />
              <HeroSection />
              <CoursesSection onStartCourse={handleStartCourse} />
              <AboutSection />
              <AchievementsSection />
              <TestimonialsSection />
              <CtaSection
                onLogin={() => setIsLoginModalOpen(true)}
                onRegister={() => setIsRegisterModalOpen(true)}
              />
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
              />

              <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={currentCourse} // ✅ совпадает по типу
              />
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
