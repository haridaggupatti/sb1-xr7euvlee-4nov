import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'student' | 'instructor' | 'parent'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin/students'); // Changed to redirect to students page for admin
      } else if (data.role === 'student') {
        navigate('/student/dashboard');
      } else if (data.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/parent/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Login to QLearn
      </h1>
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              role === 'admin'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              role === 'student'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              role === 'instructor'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setRole('instructor')}
          >
            Instructor
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              role === 'parent'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setRole('parent')}
          >
            Parent
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={`space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
        {role !== 'admin' && (
          <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Register here
            </a>
          </p>
        )}
      </form>
      
      {role === 'admin' && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
          <p className="text-sm">
            <strong>Admin Login:</strong><br />
            Email: admin@qlearn.com<br />
            Password: admin123
          </p>
        </div>
      )}
    </div>
  );
};