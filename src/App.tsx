import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentsPage } from './pages/admin/StudentsPage';
import { TeachersPage } from './pages/admin/TeachersPage';
import { MappingPage } from './pages/admin/MappingPage';
import { ParentsPage } from './pages/admin/ParentsPage';
import { Layout } from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin/students"
                element={
                  <PrivateRoute role="admin">
                    <StudentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <PrivateRoute role="admin">
                    <TeachersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/mapping"
                element={
                  <PrivateRoute role="admin">
                    <MappingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/parents"
                element={
                  <PrivateRoute role="admin">
                    <ParentsPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;