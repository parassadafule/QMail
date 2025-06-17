import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Trash2, Archive, MailOpen, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

/**
 * Represents a single email row in the list.
 */
const EmailListItem = ({ email, onEmailAction, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    // Avoid navigating when clicking on the checkbox or action buttons
    if (
      e.target.closest('.email-actions') ||
      e.target.closest('[data-state="checked"]') ||
      e.target.closest('[data-state="unchecked"]')
    ) {
      return;
    }

    // If the email was unread, toggle it to read before navigating
    if (!email.is_read) {
      onEmailAction(email._id, 'toggleRead');
    }
    navigate(`/email/${email._id}`);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={handleNavigate}
      className={`flex items-center p-3 md:p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-150 cursor-pointer group ${email.is_read ? 'bg-slate-800/30' : 'bg-sky-900/10'
        } ${isSelected ? 'bg-sky-700/20' : ''}`}
    >
      <div className="flex items-center space-x-3 md:space-x-4 mr-2 md:mr-4 email-actions">
        <Checkbox
          id={`select-${email._id}`}
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(checked)}
          aria-label={`Select email from ${email.sender}`}
          className="border-slate-500 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEmailAction(email._id, 'toggleStar');
              }}
              className={`h-8 w-8 p-0 ${email.starred ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-500 hover:text-yellow-400'
                }`}
              aria-label={email.starred ? 'Unstar email' : 'Star email'}
            >
              <Star size={18} fill={email.starred ? 'currentColor' : 'none'} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
            <p>{email.starred ? 'Unstar' : 'Star'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Avatar className="h-8 w-8 md:h-10 md:w-10 mr-3 md:mr-4">
        {email.avatar ? (
          <AvatarImage src={email.avatar} alt={`${email.sender} avatar`} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs md:text-sm">
            {getInitials(email.sender)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p
            className={`text-sm md:text-base font-semibold truncate ${email.is_read ? 'text-slate-400' : 'text-slate-100'
              }`}
          >
            {email.sender}
          </p>
          <span
            className={`text-xs md:text-sm ml-2 flex-shrink-0 ${email.is_read ? 'text-slate-500' : 'text-slate-300 font-medium'
              }`}>
            {formatDate(email.createdAt)}
          </span>
        </div>
        <p className={`text-sm truncate ${email.is_read ? 'text-slate-500' : 'text-slate-200'}`}>
          {email.encrypted_subject}
        </p>
        <p className="text-xs text-slate-500 truncate hidden md:block">{email.snippet}</p>
      </div>

      <div className="ml-2 md:ml-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 email-actions">
        {email.folder !== 'trash' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmailAction(email._id, 'moveToTrash');
                }}
                className="h-8 w-8 p-0 text-slate-500 hover:text-red-400"
                aria-label="Move to trash"
              >
                <Trash2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
              <p>Trash</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmailAction(email._id, 'restore');
                }}
                className="h-8 w-8 p-0 text-slate-500 hover:text-green-400"
                aria-label="Restore email"
              >
                <Archive size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
              <p>Restore</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEmailAction(email._id, 'toggleRead');
              }}
              className="h-8 w-8 p-0 text-slate-500 hover:text-sky-400"
              aria-label={email.is_read ? 'Mark as unread' : 'Mark as read'}
            >
              {email.is_read ? <Mail size={18} /> : <MailOpen size={18} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
            <p>{email.is_read ? 'Mark unread' : 'Mark read'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
};

const EmailList = ({ title }) => {
  const [emails, setEmails] = useState([]); // Initialize as empty array
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch inbox messages
  useEffect(() => {
    const fetchInbox = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setEmails([]);

        const lowerTitle = title.toLowerCase(); // 'inbox', 'sent', or 'trash'
        const url =
          lowerTitle === 'sent'
            ? 'https://qmail.nextsquaretech.com/sent'
            : lowerTitle === 'trash'
              ? 'https://qmail.nextsquaretech.com/trash'
              : 'https://qmail.nextsquaretech.com/inbox';

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Log response for debugging
        console.log('API Response:', res);

        // Validate response structure
        if (!res.data || !Array.isArray(res.data.emails)) {
          console.warn('Invalid inbox_emails format:', res.data);
          setEmails([]); // Fallback to empty array
          setError(res.data?.message || 'Invalid response format from server');
          return;
        }

        setEmails(res.data.emails); // Set emails from inbox_emails
      } catch (err) {
        console.error('Error fetching inbox:', err);
        const errorMessage = err.response?.data?.message
          ? `Server message: ${err.response.data.message}`
          : 'Failed to fetch emails. Please check your network or server status.';
        setError(errorMessage);
        setEmails([]); // Ensure emails is an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [token]);

  // Handle individual select/unselect
  const handleSelectEmail = (emailId, checked) => {
    setSelectedEmails((prev) => {
      const updated = new Set(prev);
      if (checked) updated.add(emailId);
      else updated.delete(emailId);
      return updated;
    });
  };

  // Check/uncheck all emails
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmails(new Set(emails.map((e) => e._id)));
    } else {
      setSelectedEmails(new Set());
    }
  };

  const isAllSelected = emails && emails.length > 0 && selectedEmails.size === emails.length;

  // Handle email actions
  const onEmailAction = async (emailId, action) => {
    // Optimistic UI update
    setEmails((prev) =>
      prev.map((e) => {
        if (e._id !== emailId) return e;
        switch (action) {
          case 'toggleStar':
            return { ...e, starred: !e.starred };
          case 'toggleRead':
            return { ...e, isRead: !e.isRead }; // Changed from read to isRead to match backend
          case 'moveToTrash':
            return { ...e, folder: 'trash' };
          case 'restore':
            return { ...e, folder: 'inbox' };
          default:
            return e;
        }
      })
    );

    setSelectedEmails((prev) => {
      const s = new Set(prev);
      s.delete(emailId);
      return s;
    });

    // TODO: Implement real API calls, e.g.:
    // await axios.patch(`http://localhost:5000/mail/${emailId}`, { [action]: true }, { headers: { Authorization: `Bearer ${token}` } });
  };

  // Bulk-action shortcuts
  const handleBulkAction = (action) => {
    selectedEmails.forEach((emailId) => onEmailAction(emailId, action));
    setSelectedEmails(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Loading your emails…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
        <MailOpen size={64} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-center text-red-400">{error}</p>
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
        <MailOpen size={64} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">It’s quiet in here…</h2>
        <p className="text-center">
          There are no emails in your {title.toLowerCase()} folder.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all emails"
            className="border-slate-500 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
          />
          {selectedEmails.size > 0 && (
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulkAction('moveToTrash')}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                    aria-label="Move selected to trash"
                  >
                    <Trash2 size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
                  <p>Trash Selected</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulkAction('toggleRead')}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-sky-400"
                    aria-label="Mark selected as read/unread"
                  >
                    <MailOpen size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-slate-200 border-slate-700">
                  <p>Mark Selected Read/Unread</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="secondary" className="ml-2 bg-sky-500/20 text-sky-300">
                {selectedEmails.size} selected
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-400">{emails.length} emails</p>
      </div>
      <div className="divide-y divide-slate-700/50">
        {emails.map((email) => (
          <EmailListItem
            key={email._id}
            email={email}
            onEmailAction={onEmailAction}
            isSelected={selectedEmails.has(email._id)}
            onSelect={(checked) => handleSelectEmail(email._id, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmailList;
