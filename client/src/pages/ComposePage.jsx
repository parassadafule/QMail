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

      const response = await axios.post('http://localhost:5000/send', emailData, config);
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
      className="max-w-4xl mx-auto p-4 md:p-6 bg-card/70 backdrop-blur-lg rounded-xl shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text hover:text-primary hover:bg-muted/50">
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-red-500">
          Compose New Email
        </h1>
        <div></div>
      </div>

      <form onSubmit={handleSendEmail} className="space-y-6">
        <div>
          <Label htmlFor="to" className="text-sm font-medium text mb-1 block">To</Label>
          <Input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@qmail.website"
            className="bg-input border-input placeholder:text text-foreground focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <Label htmlFor="subject" className="text-sm font-medium text mb-1 block">Subject</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject"
            className="bg-input border-input placeholder:text text-foreground focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <Label htmlFor="body" className="text-sm font-medium text mb-1 block">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email content here..."
            rows={12}
            className="bg-input border-input placeholder:text text-foreground focus:ring-primary focus:border-primary resize-none scrollbar-thin scrollbar-thumb-muted scrollbar-track-input"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="border-input text hover:bg-muted hover:text-primary">
              <Paperclip size={18} className="mr-2" /> Attach
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {attachedFile && (
              <p className="text text-sm mt-1 ml-1">
                Attached: <strong>{attachedFile.name}</strong>
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="ghost" onClick={() => { setTo(''); setSubject(''); setBody(''); toast({ title: "Discarded", description: "Email draft has been discarded." }) }} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              <Trash2 size={18} className="mr-2" /> Discard
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-3">
              <Send size={18} className="mr-2" /> Send Email
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ComposePage;
