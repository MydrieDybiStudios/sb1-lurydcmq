export interface Lesson {
  title: string;
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Test {
  title: string;
  questions: Question[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  icon?: string;
  lessons: Lesson[];
  test: Test;
}

export interface UserCourseProgress {
  courseId: number;
  currentLesson: number;
  completed: boolean;
  testScore?: number;
  lastActivity?: Date;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  dateEarned: Date;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  progress: UserCourseProgress[];
  achievements: UserAchievement[];
}