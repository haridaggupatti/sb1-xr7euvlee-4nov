import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                QLearn
              </Link>
              {token && (
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to={`/${userRole}/dashboard`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {token ? (
                <button
                  onClick={handleLogout}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};