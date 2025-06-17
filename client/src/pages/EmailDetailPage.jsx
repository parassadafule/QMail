import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Trash2, Reply, ReplyAll, Forward, Printer, MoreVertical, Lock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const EmailDetailPage = ({ onEmailAction }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`https://qmail.nextsquaretech.com/qmail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch email');
        }

        const data = await res.json();
        console.log('Fetched email:', data);
        setEmail(data.email);
      } catch (err) {
        console.error('Error fetching email:', err);
        setError('Email could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  const handleDecrypt = async () => {
    if (isDecrypting) return; // Prevent multiple clicks

    try {
      setIsDecrypting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        navigate("/");
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post('http://localhost:5000/decrypt', { emailId: id }, config);
      console.log('Decryption response:', response.data);

      if (response.data.decryptedContent) {
        setDecryptedContent(response.data.decryptedContent);
        setIsDecrypted(true);
        toast({
          title: "Success",
          description: "Email decrypted successfully"
        });
      } else {
        throw new Error('Decryption failed or incomplete data returned');
      }
    } catch (error) {
      console.error('Error decrypting email:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to decrypt email",
        variant: "destructive"
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Loading email...</div>;
  }

  if (error || !email) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <h2 className="text-2xl font-semibold">Email not found</h2>
        <p>{error || 'The email does not exist or has been moved.'}</p>
        <Button onClick={() => navigate('/inbox')} className="mt-4 bg-sky-500 hover:bg-sky-600">
          Go to Inbox
        </Button>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0];
  };

  const handleAction = (actionType) => {
    onEmailAction(email.id, actionType);
    if (actionType === 'moveToTrash') {
      navigate(`/${email.folder === 'trash' ? 'inbox' : 'trash'}`); // Navigate away if moved to trash
    }
    // For other actions, we might want to update the email state locally or rely on parent state update
  };

  const formatDateDetailed = (dateString) => {
    return new Date(dateString).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 100, duration: 0.4 }}
      className="bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden h-full flex flex-col"
    >
      <header className="p-4 md:p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800/80 backdrop-blur-sm z-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-300 hover:text-sky-400 hover:bg-slate-700/50">
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleAction('toggleStar')} className={`h-9 w-9 p-0 ${email.starred ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-yellow-400'}`}>
            <Star size={20} fill={email.starred ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleAction('moveToTrash')} className="h-9 w-9 p-0 text-slate-400 hover:text-red-400">
            <Trash2 size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0 text-slate-400 hover:text-sky-400">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200 shadow-xl">
              <DropdownMenuItem onClick={() => toast({ title: "Feature not implemented", description: "Reply functionality coming soon!" })} className="hover:bg-slate-700/80 focus:bg-slate-700/80">
                <Reply size={16} className="mr-2" /> Reply
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Feature not implemented", description: "Reply All functionality coming soon!" })} className="hover:bg-slate-700/80 focus:bg-slate-700/80">
                <ReplyAll size={16} className="mr-2" /> Reply All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Feature not implemented", description: "Forward functionality coming soon!" })} className="hover:bg-slate-700/80 focus:bg-slate-700/80">
                <Forward size={16} className="mr-2" /> Forward
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={() => handleAction('toggleRead')} className="hover:bg-slate-700/80 focus:bg-slate-700/80">
                {email.is_read ? 'Mark as unread' : 'Mark as read'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Feature not implemented", description: "Print functionality coming soon!" })} className="hover:bg-slate-700/80 focus:bg-slate-700/80">
                <Printer size={16} className="mr-2" /> Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-4 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3 break-words">
          {isDecrypted ? decryptedContent?.subject : email.encrypted_subject}
        </h1>
        {email.tags && email.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {email.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-sky-500/20 text-sky-300 border-sky-500/30">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-700">
          <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-sky-500">
            <AvatarImage src={email.avatar} alt={`${email.sender} avatar`} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-lg">
              {getInitials(email.sender)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
              <p className="text-base md:text-lg font-semibold text-slate-200 truncate">{email.sender}</p>
              <p className="text-xs md:text-sm text-slate-400 mt-1 sm:mt-0">{formatDateDetailed(email.date)}</p>
            </div>
            <p className="text-sm text-slate-400 truncate">To: {email.to || 'You'}</p>
          </div>
        </div>

        <article
          className="prose prose-sm md:prose-base prose-invert max-w-none text-slate-300 leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: isDecrypted ? decryptedContent?.body : email.encrypted_body }}
        />

        {isDecrypted && decryptedContent?.file && (
          <div className="mt-6 p-4 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Attached File</h3>
            <a 
              href={decryptedContent.file.url} 
              download={decryptedContent.file.name}
              className="inline-flex items-center text-sky-400 hover:text-sky-300"
            >
              <span className="mr-2">📎</span>
              {decryptedContent.file.name}
            </a>
          </div>
        )}
      </div>

      <footer className="p-4 md:p-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        {!isDecrypted && (
          <Button 
            variant="outline" 
            onClick={handleDecrypt}
            disabled={isDecrypting}
            className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-sky-400"
          >
            <Lock size={18} className="mr-2" /> 
            {isDecrypting ? 'Decrypting...' : 'Decrypt'}
          </Button>
        )}
        <Button variant="outline" onClick={() => toast({ title: "Feature not implemented", description: "Reply functionality coming soon!" })} className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-sky-400">
          <Reply size={18} className="mr-2" /> Reply
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Feature not implemented", description: "Reply All functionality coming soon!" })} className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-sky-400">
          <ReplyAll size={18} className="mr-2" /> Reply All
        </Button>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold" onClick={() => toast({ title: "Feature not implemented", description: "Forward functionality coming soon!" })}>
          <Forward size={18} className="mr-2" /> Forward
        </Button>
      </footer>
    </motion.div>
  );
};

export default EmailDetailPage;
