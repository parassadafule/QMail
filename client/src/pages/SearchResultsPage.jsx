import React from 'react';
import { useLocation } from 'react-router-dom';
import EmailList from '@/components/EmailList';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const SearchResultsPage = ({ allEmails, onEmailAction }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';

  const filteredEmails = React.useMemo(() => {
    if (!searchTerm) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allEmails.filter(email =>
      email.subject.toLowerCase().includes(lowerSearchTerm) ||
      email.sender.toLowerCase().includes(lowerSearchTerm) ||
      (email.to && email.to.toLowerCase().includes(lowerSearchTerm)) ||
      email.body.toLowerCase().includes(lowerSearchTerm) ||
      (email.tags && email.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm, allEmails]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
        Search Results for: <span className="text-foreground">"{searchTerm}"</span>
      </h1>
      {filteredEmails.length > 0 ? (
        <EmailList emails={filteredEmails} onEmailAction={onEmailAction} title={`Search results for "${searchTerm}"`} showNoEmailsMessage={false} />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text p-8 bg-card/50 backdrop-blur-sm rounded-xl shadow-xl">
          <SearchX size={64} className="mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-center">We couldn't find any emails matching your search for "{searchTerm}".</p>
          <p className="text-center text-sm mt-1">Try using different keywords or checking for typos.</p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResultsPage;
