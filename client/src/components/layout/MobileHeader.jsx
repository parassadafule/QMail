import React, { useState } from 'react';
import { Menu, X, Search, Mail, Edit3, Inbox, Send, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { name: 'Inbox', icon: Inbox, path: '/inbox' },
  { name: 'Sent', icon: Send, path: '/sent' },
  { name: 'Trash', icon: Trash2, path: '/trash' },
];

const MobileHeader = ({ onMenuToggle, searchTerm, setSearchTerm, onSearchSubmit, onLogout }) => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const userEmail = localStorage.getItem('userEmail') || 'user@qmail.website';
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b shadow-md">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)} className="text hover:text-accent-foreground">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-background border-r text-foreground p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center space-x-2">
              <Mail size={28} className="text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-foreground">QMail</span>
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-4">
            <Button
              onClick={() => {
                navigate('/compose');
                setIsSheetOpen(false);
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
            >
              <Edit3 size={18} className="mr-2" />
              Compose
            </Button>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSheetOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-md transition-colors duration-200
                    ${isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted/50 text hover:text-foreground'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src="" alt="User Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs md:text-sm">
                    {getInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                  <span className="text-xs text">{userEmail}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSheetOpen(false);
                  if (onLogout) onLogout();
                }}
                className="h-8 w-8 rounded-full text hover:text-foreground hover:bg-muted"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 mx-4"
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="search"
            placeholder="Search mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-input placeholder-muted-foreground text-foreground focus:ring-ring focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text" />
        </form>
      </motion.div>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Avatar className="h-8 w-8 md:hidden">
          <AvatarImage src="" alt="User Avatar" />
          <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-rose-500 text-white text-xs">{getInitials(userEmail)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default MobileHeader;
