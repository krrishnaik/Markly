import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { LeadMarking } from './pages/lead/LeadMarking';
import { FacultyConflicts } from './pages/faculty/FacultyConflicts';
import { Profile } from './pages/Profile';
// Import new pages
import { Announcements } from './pages/Announcements';
import { CreateMeet } from './pages/lead/CreateMeet';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Announcements (New) */}
      <Route 
        path="/announcements" 
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        } 
      />

      {/* Create Meeting (New - Lead Only) */}
      <Route 
        path="/create-meeting" 
        element={
          <ProtectedRoute>
            <CreateMeet />
          </ProtectedRoute>
        } 
      />

      {/* Existing Routes */}
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <StudentAttendance />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/mark-attendance" 
        element={
          <ProtectedRoute>
            <LeadMarking />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/conflicts" 
        element={
          <ProtectedRoute>
            <FacultyConflicts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;