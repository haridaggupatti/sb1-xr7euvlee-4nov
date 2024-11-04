export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  modules: Module[];
  createdAt: string;
}

export interface Module {
  id: number;
  title: string;
  courseId: number;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: number;
  title: string;
  moduleId: number;
  videoUrl: string;
  content: string;
  order: number;
  test?: Test;
  project?: Project;
}

export interface Test {
  id: number;
  lessonId: number;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: number;
  testId: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Project {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  requirements: string[];
}

export interface Progress {
  userId: number;
  courseId: number;
  moduleId: number;
  lessonId: number;
  completed: boolean;
  score?: number;
  timeSpent: number;
  lastAccessed: string;
}