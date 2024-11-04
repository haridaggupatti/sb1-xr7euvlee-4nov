import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Brain, Award, Gamepad, Monitor, Briefcase, LineChart, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const token = localStorage.getItem('token');

  if (token) {
    const role = localStorage.getItem('userRole');
    navigate(role === 'student' ? '/student/dashboard' : '/instructor/dashboard');
    return null;
  }

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: 'Quality Learning',
      description: 'Premium courses crafted by industry experts with real-world applications.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Quick Mastery',
      description: 'Accelerated learning paths optimized for rapid skill acquisition.'
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'Quantifiable Results',
      description: 'Track your progress with detailed analytics and achievements.'
    },
    {
      icon: <Brain className="w-8 h-8 text-green-500" />,
      title: 'AI-Powered Learning',
      description: 'Personalized guidance and adaptive learning powered by advanced AI.'
    }
  ];

  const benefits = [
    {
      icon: <Monitor className="w-6 h-6 text-indigo-400" />,
      title: 'Cross-Platform Access',
      description: 'Learn seamlessly across all your devices'
    },
    {
      icon: <Gamepad className="w-6 h-6 text-pink-400" />,
      title: 'Gamified Experience',
      description: 'Earn rewards while you learn'
    },
    {
      icon: <Users className="w-6 h-6 text-teal-400" />,
      title: 'Community Learning',
      description: 'Connect with peers and mentors'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-purple-100 via-blue-100 to-gray-100'} opacity-50`}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              QLearn
            </h1>
            <p className={`text-2xl md:text-3xl font-light mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Where Quality Meets Quick Learning
            </p>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto mb-12`}>
              Transform your learning journey with our innovative platform that prioritizes
              Quality education, Quick mastery, and Quantifiable results.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg"
              >
                Start Learning
              </Button>
              <Button 
                variant="secondary"
                onClick={() => navigate('/login')}
                className="px-8 py-3 text-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              Why Choose QLearn?
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Experience education reimagined for the modern learner
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                } p-6 rounded-xl border transition-all duration-300`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-lg`}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {benefit.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Transform Your Learning Journey?
          </h2>
          <Button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-purple-900 hover:bg-gray-100 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};