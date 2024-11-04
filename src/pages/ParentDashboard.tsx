import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Progress } from '../types';
import { ProgressChart } from '../components/progress/ProgressChart';
import { Calendar, Mail, GraduationCap, Clock, CheckCircle, XCircle, BookOpen, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';

export const ParentDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const { data: children } = useQuery<User[]>({
    queryKey: ['children'],
    queryFn: async () => {
      const response = await fetch('/api/parent/children', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch children');
      return response.json();
    },
  });

  const { data: childData } = useQuery({
    queryKey: ['childData', selectedChild],
    enabled: !!selectedChild,
    queryFn: async () => {
      const [progressRes, attendanceRes, gradesRes, eventsRes] = await Promise.all([
        fetch(`/api/parent/progress/${selectedChild}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/parent/attendance/${selectedChild}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/parent/grades/${selectedChild}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/parent/events/${selectedChild}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const [progress, attendance, grades, events] = await Promise.all([
        progressRes.json(),
        attendanceRes.json(),
        gradesRes.json(),
        eventsRes.json(),
      ]);

      return { progress, attendance, grades, events };
    },
  });

  const selectedChildInfo = children?.find(child => child.id === selectedChild);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header and Student Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Monitor your children's academic journey
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={selectedChild || ''}
              onChange={(e) => setSelectedChild(Number(e.target.value))}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select Student</option>
              {children?.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedChild && selectedChildInfo && childData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Quick Overview
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Grade</span>
                  <span className="font-bold text-green-500">
                    {childData.grades.averageGrade}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Attendance Rate</span>
                  <span className="font-bold text-blue-500">
                    {childData.attendance.attendanceRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed Courses</span>
                  <span className="font-bold text-purple-500">
                    {childData.progress.completedCourses}/{childData.progress.totalCourses}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Progress */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg lg:col-span-2`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-500" />
                  Academic Progress
                </h2>
                <Button onClick={() => setShowMessageModal(true)}>
                  Contact Teachers
                </Button>
              </div>
              <div className="space-y-4">
                {childData.grades.courses.map((course: any) => (
                  <div key={course.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{course.name}</h3>
                      <span className={`px-2 py-1 rounded ${
                        course.grade >= 90 ? 'bg-green-100 text-green-800' :
                        course.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                        course.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.grade}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Calendar */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Attendance
              </h2>
              <div className="space-y-2">
                {childData.attendance.recent.map((record: any) => (
                  <div key={record.date} className="flex items-center justify-between">
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                    {record.present ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              {childData.attendance.absences.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>Recent Absences</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {childData.attendance.absences.map((absence: any) => (
                      <li key={absence.date}>
                        {new Date(absence.date).toLocaleDateString()} - {absence.reason || 'No reason provided'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Upcoming Assignments */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                Upcoming Assignments
              </h2>
              <div className="space-y-4">
                {childData.progress.assignments.map((assignment: any) => (
                  <div key={assignment.id} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Course: {assignment.course}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {childData.progress.achievements.map((achievement: any) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <Award className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg lg:col-span-2`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {childData.events.map((event: any) => (
                  <div key={event.id} className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a student to view their academic information
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-lg w-full`}>
              <h3 className="text-xl font-semibold mb-4">Message Teachers</h3>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className={`w-full p-2 rounded-lg mb-4 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select Teacher</option>
                {childData?.grades.courses.map((course: any) => (
                  <option key={course.id} value={course.teacherId}>
                    {course.teacherName} - {course.name}
                  </option>
                ))}
              </select>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className={`w-full h-32 p-2 rounded-lg mb-4 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Type your message here..."
              />
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // TODO: Implement message sending
                    setShowMessageModal(false);
                    setMessageText('');
                    setSelectedTeacher('');
                  }}
                  disabled={!selectedTeacher || !messageText.trim()}
                >
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};