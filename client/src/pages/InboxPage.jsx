import React from 'react';
import EmailList from '@/components/EmailList';
import { motion } from 'framer-motion';

const InboxPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500">
        Inbox
      </h1>
      <EmailList title="inbox" />
    </motion.div>
  );
};

export default InboxPage;
