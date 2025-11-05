import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Inbox, Send, Trash2, Edit3, Star, Settings, LogOut, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { name: 'Inbox', icon: Inbox, path: '/inbox' },
  { name: 'Sent', icon: Send, path: '/sent' },
  { name: 'Trash', icon: Trash2, path: '/trash' },
];

const Sidebar = ({ onComposeClick, onLogout }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'user@qmail.website';
  const userInitials = userEmail.charAt(0).toUpperCase();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="hidden md:flex md:w-64 lg:w-72 flex-col bg-background border-r p-4 h-full">
        
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">QMail</h1>
        </div>
      </div>

      <Button
        onClick={onComposeClick}
        className="mb-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
      >
        <Edit3 className="mr-2 h-4 w-4" /> Compose
      </Button>

      <nav className="space-y-1 mb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${isActive
                ? 'bg-accent text-accent-foreground'
                : 'text hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{userEmail}</span>
              {/* <span className="text-xs text">Free Account</span> */}
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="h-8 w-8 rounded-full text hover:text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
