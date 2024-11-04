import React, { useState } from 'react';
import { Course } from '../../types';
import { Button } from '../Button';

interface CourseManagerProps {
  courses: Course[];
}

export const CourseManager: React.FC<CourseManagerProps> = ({ courses }) => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement course creation
    setIsAddingCourse(false);
    setNewCourse({ title: '', description: '' });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Courses</h3>
          <p className="mt-1 text-sm text-gray-500">Manage your courses</p>
        </div>
        <Button onClick={() => setIsAddingCourse(true)}>Add Course</Button>
      </div>

      {isAddingCourse && (
        <div className="p-4 border-b">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsAddingCourse(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {courses.map((course) => (
          <li key={course.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-500">{course.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created on {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  onClick={() => {/* TODO: Implement edit course */}}
                >
                  Edit
                </button>
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  onClick={() => {/* TODO: Implement delete course */}}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};