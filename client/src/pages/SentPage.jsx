import React from 'react';
import EmailList from '@/components/EmailList';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SentPage = ({ onEmailAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-1">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-500 to-lime-600">
          Sent Mail
        </h1>
      </div>
      <EmailList title="sent" />
    </motion.div>
  );
};

export default SentPage;
