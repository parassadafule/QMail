import React, { useState } from 'react';
import { LoginPage, SignupPage } from '@/components/AuthForms/AuthForms';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900"
    >
      {isLogin ? (
        <LoginPage onNavigateToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupPage onNavigateToLogin={() => setIsLogin(true)} />
      )}
    </motion.div>
  );
};

export default AuthPage;