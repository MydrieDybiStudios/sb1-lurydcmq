import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Users, Home, Info, Book, Check, Download } from 'lucide-react';
import CoursesSection from './components/CoursesSection';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import AchievementsSection from './components/AchievementsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import CourseModal from './components/CourseModal';
import { Course } from './types/course';
import './index.css';
import coursesData from './data/coursesData';

function App() {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  const handleStartCourse = (courseId: number) => {
    const course = coursesData.find(course => course.id === courseId);
    if (course) {
      setCurrentCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <HeroSection />
      <CoursesSection onStartCourse={handleStartCourse} />
      <AboutSection />
      <AchievementsSection />
      <TestimonialsSection />
      <CtaSection onLogin={handleLogin} onRegister={handleRegister} />
      <Footer />

      {/* Modals */}
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
        course={currentCourse}
      />
    </div>
  );
}

export default App;