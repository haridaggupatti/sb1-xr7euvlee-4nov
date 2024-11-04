import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'student' | 'instructor' | 'parent';
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};