
import React from 'react';
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

const TrashPage = ({ onEmailAction }) => {
  const { toast } = useToast();

  const handleEmptyTrash = () => {
    emails.forEach(email => onEmailAction(email.id, 'deletePermanently'));
    toast({
      title: "Trash Emptied",
      description: "All emails in trash have been permanently deleted.",
      variant: "destructive",
    });
  };

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
                <Trash2 size={18} className="mr-2" /> Empty Trash Now
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
      <EmailList emails={emails} onEmailAction={onEmailAction} title="trash" />
    </motion.div>
  );
};

export default TrashPage;
