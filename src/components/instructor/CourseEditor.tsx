import React, { useState } from 'react';
import { Course, Module, Lesson } from '../../types';
import { Button } from '../Button';

interface CourseEditorProps {
  course: Course;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  course,
  onSave,
  onCancel,
}) => {
  const [editedCourse, setEditedCourse] = useState(course);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedCourse);
  };

  const addModule = () => {
    const newModule: Module = {
      id: Math.random(), // Temporary ID
      title: 'New Module',
      courseId: course.id,
      lessons: [],
      order: editedCourse.modules.length,
    };
    setEditedCourse({
      ...editedCourse,
      modules: [...editedCourse.modules, newModule],
    });
  };

  const addLesson = (moduleId: number) => {
    const newLesson: Lesson = {
      id: Math.random(), // Temporary ID
      title: 'New Lesson',
      moduleId,
      videoUrl: '',
      content: '',
      order: editedCourse.modules.find(m => m.id === moduleId)?.lessons.length || 0,
    };
    setEditedCourse({
      ...editedCourse,
      modules: editedCourse.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      ),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            value={editedCourse.title}
            onChange={(e) =>
              setEditedCourse({ ...editedCourse, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={editedCourse.description}
            onChange={(e) =>
              setEditedCourse({ ...editedCourse, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            rows={3}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Modules</h3>
            <Button type="button" onClick={addModule}>Add Module</Button>
          </div>

          {editedCourse.modules.map((module, moduleIndex) => (
            <div key={module.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) =>
                    setEditedCourse({
                      ...editedCourse,
                      modules: editedCourse.modules.map((m, i) =>
                        i === moduleIndex ? { ...m, title: e.target.value } : m
                      ),
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <Button
                  type="button"
                  onClick={() => addLesson(module.id)}
                  variant="secondary"
                >
                  Add Lesson
                </Button>
              </div>

              <div className="space-y-4 ml-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="border-l-2 pl-4">
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        setEditedCourse({
                          ...editedCourse,
                          modules: editedCourse.modules.map((m, i) =>
                            i === moduleIndex
                              ? {
                                  ...m,
                                  lessons: m.lessons.map((l, j) =>
                                    j === lessonIndex
                                      ? { ...l, title: e.target.value }
                                      : l
                                  ),
                                }
                              : m
                          ),
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Course</Button>
        </div>
      </form>
    </div>
  );
};