import React, { useState, useEffect } from 'react';
import EmailList from '@/components/EmailList';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from 'axios';

const TrashPage = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrashEmails();
  }, []);

  const fetchTrashEmails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/trash', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEmails(response.data.emails || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching trash emails:', err);
      setError(err.response?.data?.message || 'Failed to fetch trash emails');
      toast({
        title: "Error",
        description: "Failed to fetch trash emails. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete('http://localhost:5000/trash/empty', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEmails([]);
      toast({
        title: "Trash Emptied",
        description: "All emails in trash have been permanently deleted.",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error emptying trash:', err);
      toast({
        title: "Error",
        description: "Failed to empty trash. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailAction = async (emailId, action) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      switch (action) {
        case 'restore':
          await axios.post(`http://localhost:5000/trash/restore/${emailId}`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setEmails(prev => prev.filter(email => email._id !== emailId));
          toast({
            title: "Email Restored",
            description: "The email has been restored to your inbox.",
          });
          break;

        case 'deletePermanently':
          await axios.delete(`http://localhost:5000/trash/${emailId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setEmails(prev => prev.filter(email => email._id !== emailId));
          toast({
            title: "Email Deleted",
            description: "The email has been permanently deleted.",
            variant: "destructive"
          });
          break;

        default:
          break;
      }
    } catch (err) {
      console.error('Error performing email action:', err);
      toast({
        title: "Error",
        description: "Failed to perform the action. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-1">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-pink-600">
          Trash
        </h1>
        {emails.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                <Trash2 size={18} className="mr-2" /> Empty Trash
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-400">
                  <AlertTriangle size={22} className="mr-2" /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently delete all {emails.length} items in your trash.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmptyTrash} className="bg-red-600 hover:bg-red-700 text-white">
                  Yes, Empty Trash
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <EmailList emails={emails} onEmailAction={handleEmailAction} title="trash" />
    </motion.div>
  );
};

export default TrashPage;
