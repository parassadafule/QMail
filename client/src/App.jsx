import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { MailPlus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import { LoginPage, SignupPage } from '@/components/AuthForms/AuthForms';
import LandingPage from '@/pages/LandingPage';
import InboxPage from '@/pages/InboxPage';
import SentPage from '@/pages/SentPage';
import TrashPage from '@/pages/TrashPage';
import ComposePage from '@/pages/ComposePage';
import EmailDetailPage from '@/pages/EmailDetailPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import AuthPage from '@/pages/AuthPage';
// import axios from 'axios';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });
  const [emails, setEmails] = useState(() => {
    const savedEmails = localStorage.getItem('emails');
    try {
      return savedEmails ? JSON.parse(savedEmails) : [];
    } catch (error) {
      console.error("Error parsing emails from localStorage", error);
      return [];
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('emails', JSON.stringify(emails));
    } catch (error) {
      console.error("Error saving emails to localStorage", error);
    }
  }, [emails]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //     navigate('/');
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //     navigate('/');
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    navigate('/');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const [searchTerm, setSearchTerm] = useState('');

  const userName = localStorage.getItem('userName') || 'User';

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {isAuthenticated && location.pathname !== '/' && <Sidebar onComposeClick={() => navigate('/compose')} onLogout={handleLogout} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isAuthenticated && location.pathname !== '/' && (
          <MobileHeader 
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}
            onLogout={handleLogout}
            userName={userName}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={isAuthenticated ? "flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background" : "flex-1"}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/inbox" replace />} />
              <Route path="/signup" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
              <Route path="/sent" element={<ProtectedRoute><SentPage /></ProtectedRoute>} />
              <Route path="/trash" element={<ProtectedRoute><TrashPage /></ProtectedRoute>} />
              <Route path="/compose" element={<ProtectedRoute><ComposePage /></ProtectedRoute>} />
              <Route path="/email/:id" element={<ProtectedRoute><EmailDetailPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchResultsPage allEmails={emails} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/inbox" : "/login"} replace />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        {isAuthenticated && (
          <Button
            onClick={() => navigate('/compose')}
            className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl flex items-center justify-center z-50"
            aria-label="Compose Email">
            <MailPlus size={24} />
          </Button>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;