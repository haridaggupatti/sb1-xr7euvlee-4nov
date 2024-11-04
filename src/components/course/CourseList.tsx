import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Course } from '../../types';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';

export const CourseList: React.FC = () => {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const { data: progress } = useQuery({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      const response = await fetch('/api/progress', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  const isLessonLocked = (courseId: number, lessonId: number) => {
    if (!progress) return true;
    const previousLesson = progress.find(p => 
      p.courseId === courseId && p.lessonId === lessonId - 1
    );
    return previousLesson ? !previousLesson.completed : false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="space-y-2">
              {course.modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-3">
                  <h4 className="font-medium mb-2">{module.title}</h4>
                  <ul className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isLocked = isLessonLocked(course.id, lesson.id);
                      const isCompleted = progress?.some(p => 
                        p.lessonId === lesson.id && p.completed
                      );

                      return (
                        <li key={lesson.id} className="flex items-center justify-between">
                          <Link
                            to={isLocked ? '#' : `/course/${course.id}/lesson/${lesson.id}`}
                            className={`flex items-center ${
                              isLocked ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            {lesson.title}
                            {isCompleted && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
                            {isLocked && <Lock className="w-4 h-4 ml-2" />}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>{course.modules.length} modules</span>
              <span>
                {progress?.filter(p => p.courseId === course.id && p.completed).length || 0}/
                {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons completed
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};