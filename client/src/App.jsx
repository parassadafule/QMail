import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import InboxPage from '@/pages/InboxPage';
import SentPage from '@/pages/SentPage';
import TrashPage from '@/pages/TrashPage';
import ComposePage from '@/pages/ComposePage';
import EmailDetailPage from '@/pages/EmailDetailPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import AuthPage from '@/pages/AuthPage';
import { initialEmails } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MailPlus } from 'lucide-react';

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
      return savedEmails ? JSON.parse(savedEmails) : initialEmails;
    } catch (error) {
      console.error("Error parsing emails from localStorage", error);
      return initialEmails;
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

  // Check authentication status when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Redirect to auth page if not authenticated
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    navigate('/auth');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleEmailAction = (emailId, action) => {
    setEmails(prevEmails =>
      prevEmails.map(email => {
        if (email.id === emailId) {
          switch (action) {
            case 'toggleRead':
              return { ...email, is_read: !email.is_read };
            case 'toggleStar':
              return { ...email, starred: !email.starred };
            case 'moveToTrash':
              return { ...email, folder: 'trash' };
            case 'restore':
              return { ...email, folder: 'inbox', is_read: true };
            case 'deletePermanently':
              return null;
            default:
              return email;
          }
        }
        return email;
      }).filter(Boolean)
    );

    if (action === 'moveToTrash') {
      toast({ title: "Moved to Trash", description: "The email has been moved to trash." });
    }
    if (action === 'deletePermanently') {
      toast({ title: "Deleted Permanently", description: "The email has been permanently deleted.", variant: "destructive" });
    }
    if (action === 'restore') {
      toast({ title: "Restored", description: "The email has been restored to your inbox." });
    }
  };

  // const handleSendEmail = (newEmail) => {
  //   const emailToSend = {
  //     ...newEmail,
  //     id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  //     sender: 'You',
  //     avatar: 'https://i.pravatar.cc/40?u=currentUser',
  //     date: new Date().toISOString(),
  //     read: true,
  //     starred: false,
  //     folder: 'sent',
  //   };
  //   setEmails(prevEmails => [emailToSend, ...prevEmails]);
  //   toast({ title: "Email Sent!", description: "Your email has been successfully sent." });
  //   navigate('/sent');
  // };
  
  const [searchTerm, setSearchTerm] = useState('');

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-slate-100 overflow-hidden">
      {isAuthenticated && <Sidebar onComposeClick={() => navigate('/compose')} onLogout={handleLogout} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isAuthenticated && (
          <MobileHeader 
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}`)}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={isAuthenticated ? "flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800" : "flex-1"}
          >
            <Routes location={location}>
              {/* Redirect root path to auth page if not authenticated, otherwise to inbox */}
              <Route path="/" element={!isAuthenticated ? <Navigate to="/auth" replace /> : <Navigate to="/inbox" replace />} />
              <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<ProtectedRoute><InboxPage onEmailAction={handleEmailAction} /></ProtectedRoute>} />
              <Route path="/sent" element={<ProtectedRoute><SentPage onEmailAction={handleEmailAction} /></ProtectedRoute>} />
              <Route path="/trash" element={<ProtectedRoute><TrashPage onEmailAction={handleEmailAction} /></ProtectedRoute>} />
              <Route path="/compose" element={<ProtectedRoute><ComposePage /></ProtectedRoute>} />
              <Route path="/email/:id" element={<ProtectedRoute><EmailDetailPage onEmailAction={handleEmailAction} /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchResultsPage allEmails={emails} onEmailAction={handleEmailAction} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/inbox" : "/auth"} replace />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        {isAuthenticated && (
          <Button
            onClick={() => navigate('/compose')}
            className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-xl flex items-center justify-center z-50"
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