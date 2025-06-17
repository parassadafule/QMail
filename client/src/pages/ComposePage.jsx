
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Paperclip, Smile, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const ComposePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // triggers hidden input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      toast({
        title: "Missing Fields",
        description: "Please fill in To, Subject, and Body fields.",
        variant: "destructive",
      });
      return;
    }

    // const response = await axios.post('http://localhost:5000/send', emailData);
    // console.log("Email sent:", response.data);
    // onSendEmail({ to, subject, body, snippet: body.substring(0, 100) + '...' });
    // setTo('');
    // setSubject('');
    // setBody('');

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        navigate("/");
        return;
      }

      const emailData = new FormData();
      emailData.append("to", to);
      emailData.append("subject", subject);
      emailData.append("body", body);
      if (attachedFile) {
        emailData.append("file", attachedFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('https://qmail.nextsquaretech.com/send', emailData, config);
      console.log("Email sent:", response.data);
      setError(null);
      // setComposeData({ to: '', subject: '', body: '' }); //Reset form
      setTo('');
      setSubject('');
      setBody('');
      toast({ title: "Mail Sent", description: "Mail sent successesfully" });
      // setComposeOpen(false); // Close modal
      // fetchEmails(); // Refresh emails after sending
    } catch (err) {
      console.error("Failed to send email:", err);
      setError(err.response?.data?.error || "Failed to send email");
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/inbox");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: 'spring', stiffness: 120, duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6 bg-slate-800/70 backdrop-blur-lg rounded-xl shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-300 hover:text-sky-400 hover:bg-slate-700/50">
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Compose New Email
        </h1>
        <div></div>
      </div>

      <form onSubmit={handleSendEmail} className="space-y-6">
        <div>
          <Label htmlFor="to" className="text-sm font-medium text-slate-300 mb-1 block">To</Label>
          <Input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="bg-slate-700/50 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="subject" className="text-sm font-medium text-slate-300 mb-1 block">Subject</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject"
            className="bg-slate-700/50 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="body" className="text-sm font-medium text-slate-300 mb-1 block">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email content here..."
            rows={12}
            className="bg-slate-700/50 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500 resize-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-700 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-sky-400">
              <Paperclip size={18} className="mr-2" /> Attach
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {attachedFile && (
              <p className="text-slate-400 text-sm mt-1 ml-1">
                Attached: <strong>{attachedFile.name}</strong>
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="ghost" onClick={() => { setTo(''); setSubject(''); setBody(''); toast({ title: "Discarded", description: "Email draft has been discarded." }) }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 size={18} className="mr-2" /> Discard
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-6 py-3">
              <Send size={18} className="mr-2" /> Send Email
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ComposePage;
