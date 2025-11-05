import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowLeft, Star, Trash2, Reply, ReplyAll, Forward } from 'lucide-react';

const EmailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decrypting, setDecrypting] = useState(false);

  
  // const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/qmail/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setEmail(response.data.email);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view this email');
        } else {
          setError('Failed to fetch email details. Please try again later.');
        }
        console.error('Error fetching email:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  const handleDecrypt = async () => {
    try {
      setDecrypting(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/decrypt`, { emailId: email._id },{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Decryption response:', response.data);

      setEmail(prevEmail => {
        const updated = {
          ...prevEmail,
          subject: response.data.decryptedContent.subject,
          body: response.data.decryptedContent.body,
          attachments: response.data.decryptedContent.file ? [response.data.decryptedContent.file] : [],
          file_name: response.data.decryptedContent.file ? response.data.decryptedContent.file.file_name : null
        };
        return updated;
      });
      setIsDecrypted(true);
    } catch (err) {
      console.error('Error decrypting email:', err);
      setError('Failed to decrypt email. Please try again later.');
    } finally {
      setDecrypting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          {error || 'Email not found'}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-background/60 backdrop-blur-md rounded-xl shadow-2xl"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card/30 border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <button className="p-2 text hover:text-yellow-400 transition-colors">
                  <Star size={20} />
                </button>
                <button className="p-2 text hover:text-destructive transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-semibold text-foreground">
                {email.subject || email.encrypted_subject || 'No Subject'}
              </h1>
              <button
                onClick={handleDecrypt}
                disabled={isDecrypted || decrypting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDecrypted
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : decrypting
                    ? 'bg-muted/50 text cursor-wait'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {decrypting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Decrypting...</span>
                  </>
                ) : isDecrypted ? (
                  <>
                    <Unlock size={18} />
                    <span>Decrypted</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Decrypt</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="text">From:</span> {email.sender || 'Unknown Sender'}
                </p>
                <p className="text-foreground">
                  <span className="text">To:</span> {email.to}
                </p>
                <p className="text">
                   {formatDate(email.created_at)}
                </p>
              </div>
            </div>

            <div className="border-t my-6"></div>

            <div className="prose prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap">
                {email.body || email.encrypted_body || 'No content'}
              </div>
            </div>

            {(email.file_name && email.file_name.trim() !== '') || (email.attachments && email.attachments.length > 0 && email.attachments.some(att => att && (typeof att === 'string' || att.file_name))) && (
              <>
                <div className="border-t my-6"></div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-wrap">
                      Attachments : {email.file_name}
                  </div>
                </div>
              </>
            )}

            {email.attachments && email.attachments.length > 0 && email.attachments.some(att => att && (typeof att === 'string' || att.file_name)) && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Download Attachments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {email.attachments.map((attachment, index) => {
                    const fileName = typeof attachment === 'string' ? attachment : attachment.file_name;
                    const downloadUrl = attachment && attachment.email_id && attachment.file_name
                      ? `http://localhost:8000/download/${attachment.email_id}`
                      : null;
                    return (
                      <div
                        key={index}
                        className="bg-muted/30 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-foreground">
                          {isDecrypted ? (
                            downloadUrl ? (
                              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/90">{fileName}</a>
                            ) : (
                              fileName
                            )
                          ) : 'Encrypted File'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t my-6"></div>

            <div className="flex flex-wrap gap-3 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text hover:bg-muted transition-colors">
                <Reply size={18} />
                Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text hover:bg-muted transition-colors">
                <ReplyAll size={18} />
                Reply All
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                <Forward size={18} />
                Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailDetailPage;
