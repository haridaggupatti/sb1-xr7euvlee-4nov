export interface Progress {
  courseId: string;
  lessonId: string;
  completed: boolean;
  timeSpent: number; // in minutes
  lastAccessed: string;
  score?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  progress: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  duration: number;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  courses: string[];
}