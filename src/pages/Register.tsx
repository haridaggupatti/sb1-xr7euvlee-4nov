import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTheme } from '../context/ThemeContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'student' | 'instructor' | 'parent'>('student');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      navigate(data.role === 'student' ? '/student/dashboard' : 
              data.role === 'instructor' ? '/instructor/dashboard' : 
              '/parent/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Create Account
      </h1>
      <div className="mb-6">
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md ${
              role === 'student'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white border border-gray-700'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
            }`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              role === 'instructor'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white border-t border-b border-gray-700'
                : 'bg-white text-gray-700 hover:text-gray-900 border-t border-b border-gray-300'
            }`}
            onClick={() => setRole('instructor')}
          >
            Instructor
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md ${
              role === 'parent'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:text-white border border-gray-700'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
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
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
        />
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
          minLength={6}
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Register as {role === 'student' ? 'Student' : role === 'instructor' ? 'Instructor' : 'Parent'}
        </Button>
        <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};