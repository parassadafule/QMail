
import React, { useState } from 'react';
import { Menu, X, Search, Mail, Edit3, Inbox, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Inbox', icon: Inbox, path: '/inbox' },
  { name: 'Sent', icon: Send, path: '/sent' },
  { name: 'Trash', icon: Trash2, path: '/trash' },
];

const MobileHeader = ({ onMenuToggle, searchTerm, setSearchTerm, onSearchSubmit }) => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 shadow-md">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)} className="text-slate-300 hover:text-sky-400">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-slate-800 border-r-slate-700 text-slate-100 p-0">
          <SheetHeader className="p-6 border-b border-slate-700">
            <SheetTitle className="flex items-center space-x-2">
              <Mail size={28} className="text-sky-400" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">MailApp</span>
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-4">
            <Button
              onClick={() => {
                navigate('/compose');
                setIsSheetOpen(false);
              }}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3"
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
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-sky-500">
                <AvatarImage src="https://i.pravatar.cc/40?u=userProfileMobile" alt="User Avatar" />
                <AvatarFallback className="bg-gradient-to-tr from-sky-500 to-indigo-600 text-white">U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-slate-200">User Name</p>
                <p className="text-xs text-slate-400">user@example.com</p>
              </div>
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
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border-slate-600 placeholder-slate-400 text-slate-100 focus:ring-sky-500 focus:border-sky-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        </form>
      </motion.div>
      
      <div className="flex items-center">
        <Avatar className="h-8 w-8 md:hidden">
          <AvatarImage src="https://i.pravatar.cc/32?u=userProfileMobileHeader" alt="User Avatar" />
          <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-rose-500 text-white text-xs">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default MobileHeader;
