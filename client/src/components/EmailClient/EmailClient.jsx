import { useState, useEffect, useRef } from 'react';
import { CircleUserRound, Send, Inbox, Plus, Menu, X, LogOut, Mail, ShieldCheck, Loader } from 'lucide-react';
import EmailViewer from '../EmailViewer/EmailViewer';
import { data } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmailClient() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState({ inbox: [], sent: [] });
  const [activeTab, setActiveTab] = useState('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedEmails, setDecryptedEmails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const emailContentRef = useRef(null);

  const navigate = useNavigate();
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const token = localStorage.getItem("token");
  const fetchProfile = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        localStorage.setItem("userEmail", data.email);
        // Fetch emails after getting user data
        fetchEmails();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        navigate("/");
        return;
      }

      const [inboxRes, sentRes] = await Promise.all([
        axios.get(`http://localhost:5000/inbox`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`http://localhost:5000/sent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      setEmails({
        inbox: inboxRes.data.inbox_emails || [],
        sent: sentRes.data.sent_emails || [],
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/");
      } else {
        setError("Failed to load emails");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchEmails();
    }
  }, [user]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Prevent back navigation after logout
  useEffect(() => {
    if (!isLoggedIn) {
      // Replace the current history entry to prevent going back
      window.history.replaceState(null, '', '/');
      
      // Add an event listener for the popstate event to handle back button
      const handlePopState = (e) => {
        // If user tries to navigate back after logout, redirect to root
        if (!isLoggedIn) {
          window.history.pushState(null, '', '/');
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isLoggedIn]);

  // Handle logout
  const handleLogout = () => {
    // Show loading state if needed
    
    // Perform logout actions
    setTimeout(() => {
      setIsLoggedIn(false);
      
      // Redirect to root
      window.location.href = '/';
    }, 500);
  };

  // Check if email has been decrypted before
  const isEmailDecrypted = (emailId) => {
    return decryptedEmails.includes(emailId);
  };

  const handleDecrypt = () => {
    setIsDecrypting(true);
    
    setTimeout(() => {
      // Add this email to the list of decrypted emails
      if (!isEmailDecrypted(selectedEmail.id)) {
        setDecryptedEmails([...decryptedEmails, selectedEmail.id]);
      }
      
      // Update the selected email
      const updatedEmail = {
        ...selectedEmail,
        body: selectedEmail.decryptedBody,
        subject: selectedEmail.decryptedSubject || selectedEmail.subject,
        encrypted: false
      };
      
      setSelectedEmail(updatedEmail);
      setIsDecrypting(false);
    }, 2000);
  };

  const markAsRead = (emailId) => {
    const updatedEmails = {
      ...emails,
      inbox: emails.inbox.map(email => 
        email.id === emailId ? { ...email, is_read: true } : email
      )
    };
    // In a real app, you would update the state here
  };

  const tabContent = {
    inbox: () => (
      <div className="space-y-1">
        {emails.inbox.map(email => (
          <EmailItem 
            key={email._id} 
            primary={email.from}
            secondary={email.subject}
            time={new Date(email.createdAt).toLocaleString()}
            read={email.is_read}
            onClick={() => handleEmailClick(email)}
          />
        ))}
      </div>
    ),
    sent: () => (
      <div className="space-y-1">
        {emails.sent.map(email => (
          <EmailItem 
            key={email._id} 
            primary={`To: ${email.to}`}
            secondary={email.subject}
            time={new Date(email.createdAt).toLocaleString()}
            read={true}
            onClick={() => handleEmailClick(email)}
          />
        ))}
      </div>
    ),
  };

  const handleSendEmail = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        navigate("/");
        return;
      }

      const emailData = {
        to: composeData.to,
        subject: composeData.subject,
        body: composeData.body
      };
      console.log("Sending:", emailData);
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post('http://localhost:5000/send', emailData, config);
      console.log("Email sent:", response.data);
      setError(null);
      setComposeData({ to: '', subject: '', body: '' }); // Reset form
      setComposeOpen(false); // Close modal
      fetchEmails(); // Refresh emails after sending
    } catch (err) {
      console.error("Failed to send email:", err);
      setError(err.response?.data?.error || "Failed to send email");
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = async (qmail) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        navigate("/");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/qmail/${qmail._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedEmail(response.data.email);
      fetchEmails(); // Refresh emails to update read status
    } catch (err) {
      console.error("Failed to fetch email:", err);
      setError("Failed to load email");
    }
  };

  // Show login page if logged out
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-2xl w-full max-w-md p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary tracking-wider">Q<span className="text-secondary">MAIL</span></h1>
            <p className="text mt-2">Quantum-secure communication</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text block">Email</label>
              <input 
                type="email" 
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.email@qmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text block">Password</label>
              <input 
                type="password" 
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••••••"
              />
            </div>
            <div className="pt-2">
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-opacity shadow-lg">
                Sign In
              </button>
            </div>
            <div className="text-center text text-sm">
              <p>Don't have an account? <a href="#" className="text-primary hover:underline">Create one</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">
      {error}
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border p-4 flex items-center justify-between relative">
        <div className="flex items-center">
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden mr-4 text hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <span className="text-xl font-semibold text-primary tracking-wider">Q<span className="text-secondary">MAIL</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavButton 
            icon={<Inbox size={20} />} 
            label="Inbox" 
            active={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')} 
            count={emails.inbox.filter(e => !e.is_read).length}
          />
          <NavButton 
            icon={<Send size={20} />} 
            label="Sent" 
            active={activeTab === 'sent'} 
            onClick={() => setActiveTab('sent')} 
          />
        </div>
        
        <div className="flex items-center space-x-4 user-menu-container">
          <button 
            onClick={toggleUserMenu}
            className="rounded-full bg-muted p-2 text hover:text-foreground hover:bg-muted/70 transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <CircleUserRound size={24} /> 
          </button>
          
          {/* User Popup Menu */}
          {userMenuOpen && (
            <div className="absolute right-4 top-16 w-64 bg-card rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary rounded-full p-2">
                    <CircleUserRound size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground font-medium">{user.name}</p>
                    <p className="text text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text hover:bg-muted/70 flex items-center space-x-2 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileNavOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="p-2 flex flex-col">
            <button 
              className={`p-3 text-left flex items-center ${activeTab === 'inbox' ? 'bg-muted text-primary' : 'text'} rounded-lg`}
              onClick={() => {
                setActiveTab('inbox');
                setMobileNavOpen(false);
              }}
            >
              <Inbox size={20} className="mr-3" />
              <span>Inbox</span>
              {emails.inbox.filter(e => !e.is_read).length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                  {emails.inbox.filter(e => !e.is_read).length}
                </span>
              )}
            </button>
            
            <button 
              className={`p-3 text-left flex items-center ${activeTab === 'sent' ? 'bg-muted text-primary' : 'text'} rounded-lg`}
              onClick={() => {
                setActiveTab('sent');
                setMobileNavOpen(false);
              }}
            >
              <Send size={20} className="mr-3" />
              <span>Sent</span>
            </button>
            
            <div className="border-t border-border mt-2 pt-2">
              <button 
                className="p-3 text-left flex items-center text rounded-lg"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <button 
              onClick={() => setComposeOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-opacity shadow-lg shadow-primary/20"
            >
              <Plus size={18} className="mr-2" />
              Compose
            </button>
          </div>
          
          {/* Email List */}
          <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {tabContent[activeTab]()}
          </div>
        </main>
      </div>

      {/* Email Viewer Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-primary">{selectedEmail.subject}</h2>
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <div>
                  <span className="font-medium">From:</span> {selectedEmail.from}
                </div>
                <div>
                  <span className="font-medium">To:</span> {selectedEmail.to}
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-4">
                <div className="prose prose-invert max-w-none">
                  {selectedEmail.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {composeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-primary">New Message</h2>
              <button 
                onClick={() => setComposeOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
                <span className="text-gray-500">To:</span>
                <input 
                  type="text" 
                  className="flex-1 bg-transparent focus:outline-none text-gray-300" 
                  placeholder="recipient@qmail.website"
                  value={composeData.to}
                  onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
                <span className="text-gray-500">Subject:</span>
                <input 
                  type="text" 
                  className="flex-1 bg-transparent focus:outline-none text-gray-300" 
                  placeholder="Type subject here"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                />
              </div>
              
              <textarea 
                className="w-full h-64 bg-gray-900 border border-gray-800 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-gray-300 resize-none"
                placeholder="Compose your message..."
                value={composeData.body}
                onChange={(e) => setComposeData({...composeData, body: e.target.value})}
              ></textarea>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for a navigation button
function NavButton({ icon, label, active, onClick, count }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'text-primary bg-gray-800' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span className={`text-xs rounded-full px-2 py-0.5 ${active ? 'bg-blue-500' : 'bg-gray-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function EmailItem({ primary, secondary, time, read, onClick }) {
  return (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer ${
        read ? 'text-gray-400' : 'text-white font-medium'
      } hover:bg-gray-900`}
      onClick={onClick}
    >      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <span className={`truncate ${read ? '' : 'text-white font-medium'}`}>{primary}</span>
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex items-center">
          <p className="truncate text-sm">{secondary}</p>
        </div>
      </div>
    </div>
  );
}