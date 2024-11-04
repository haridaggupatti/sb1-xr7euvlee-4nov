import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserCog, GitMerge, Users2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const sidebarItems: SidebarItem[] = [
    { icon: <Users className="w-5 h-5" />, label: 'Students', path: '/admin/students' },
    { icon: <UserCog className="w-5 h-5" />, label: 'Teachers', path: '/admin/teachers' },
    { icon: <GitMerge className="w-5 h-5" />, label: 'Mapping', path: '/admin/mapping' },
    { icon: <Users2 className="w-5 h-5" />, label: 'Parents', path: '/admin/parents' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-1/5 min-w-[250px] ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-4">
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Portal
          </h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 ${
                location.pathname === item.path
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};