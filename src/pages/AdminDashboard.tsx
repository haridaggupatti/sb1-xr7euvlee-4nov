import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, BookOpen, MessageSquare, Settings, UserPlus, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'parent';
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
}

export const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'communications'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // User Management
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as const,
    password: ''
  });

  // Course Management
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructorId: ''
  });

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  const { data: courses, isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', role: 'student', password: '' });
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: typeof newCourse) => {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courseData)
      });
      if (!response.ok) throw new Error('Failed to create course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowAddCourseModal(false);
      setNewCourse({ title: '', description: '', instructorId: '' });
    }
  });

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            {activeTab === 'users' && (
              <Button onClick={() => setShowAddUserModal(true)}>
                <UserPlus className="w-5 h-5 mr-2" />
                Add User
              </Button>
            )}
            {activeTab === 'courses' && (
              <Button onClick={() => setShowAddCourseModal(true)}>
                <BookOpen className="w-5 h-5 mr-2" />
                Add Course
              </Button>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'courses'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('communications')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'communications'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Communications
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map(user => (
                    <tr key={user.id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 capitalize">{user.role}</td>
                      <td className="py-3 px-4">
                        <Button variant="secondary" className="mr-2">Edit</Button>
                        <Button variant="secondary">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses?.map(course => (
                <div
                  key={course.id}
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  } rounded-lg p-6`}
                >
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {course.description}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary">Edit</Button>
                    <Button variant="secondary">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                createUserMutation.mutate(newUser);
              }}>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'student' | 'instructor' | 'parent' })}
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddUserModal(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createUserMutation.isPending}
                  >
                    Create User
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddCourseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
              <h2 className="text-xl font-bold mb-4">Add New Course</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                createCourseMutation.mutate(newCourse);
              }}>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructor</label>
                    <select
                      value={newCourse.instructorId}
                      onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      <option value="">Select Instructor</option>
                      {users?.filter(user => user.role === 'instructor').map(instructor => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddCourseModal(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createCourseMutation.isPending}
                  >
                    Create Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};