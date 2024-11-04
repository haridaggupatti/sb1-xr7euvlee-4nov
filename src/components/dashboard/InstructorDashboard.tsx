import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Course } from '../../types';
import { StudentList } from '../instructor/StudentList';
import { CourseManager } from '../instructor/CourseManager';

export const InstructorDashboard: React.FC = () => {
  const { data: students, isLoading: loadingStudents } = useQuery<User[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  const { data: courses, isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  if (loadingStudents || loadingCourses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Management</h2>
          <CourseManager courses={courses || []} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Student Overview</h2>
          <StudentList students={students || []} />
        </div>
      </div>
    </div>
  );
};