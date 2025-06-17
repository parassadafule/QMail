import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const LoginPage = ({ onNavigateToSignup }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!qmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://qmail.nextsquaretech.com/login", {  //(http://localhost:5000/login or http://192.168.1.8:5000/login)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.qmail);
        // console.log(data.qmail);

        // Redirect to dashboard or homepage
        navigate("/inbox");
      } else {
        setLoginError(data.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      setError('Invalid qmail or password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-slate-100">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your emails</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qmail" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="qmail"
                  name="qmail"
                  type="text"
                  autoComplete="qmail"
                  required
                  value={qmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-medium text-sky-400 hover:text-sky-300 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const SignupPage = ({ onNavigateToLogin }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qmail, setEmail] = useState('');
  const [fullName, setfullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullNameError, setfullNameError] = useState('');
  const [qmailError, setqmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupMessage, setSignupMessage] = useState({ type: "", message: "" });

  const validatefullName = (value) => {
    if (!/^[a-zA-Z\s*/]+$/.test(value) && value) {
      setfullNameError('Full name can only contain letters');
      return false;
    }
    setfullNameError('');
    return true;
  };

  const validateQmail = (value) => {
    if (!/^[a-zA-Z0-9*/]+$/.test(value) && value) {
      setqmailError('qmail-id can only contain letters and numbers');
      return false;
    }
    setqmailError('');
    return true;
  };

  const validatePassword = (value) => {
    if (value.length < 6 && value) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== password && value) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all inputs
    const isfullNameValid = validatefullName(fullName);
    const isqmailValid = validateQmail(qmail);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!qmail || !fullName || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!isfullNameValid || !isqmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    const fullQmail = `${qmail}@qmail.website`; // <-- important!

    setIsLoading(true);

    try {
      const response = await fetch("https://qmail.nextsquaretech.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          qmail: fullQmail, // <-- send full email
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Signup Successful", description: "Account created successfully! You can now sign in." });
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      } else {
        setSignupMessage({
          type: "error",
          message: data.message || "Something went wrong. Try again.",
        });
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen px-4"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-slate-100">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">Sign up to get started with QMail</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="fullName"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setfullName(e.target.value);
                    validatefullName(e.target.value);
                  }}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="Enter your name"
                />
              </div>
              {fullNameError && <p className="mt-1 text-xs text-red-400">{fullNameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="qmail" className="text-slate-300">Qmail</Label>
              <div className="flex items-center">
                <div className="relative flex w-full">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="qmail"
                    name="qmail"
                    type="text"
                    autoComplete="qmail"
                    required
                    value={qmail}
                    onChange={(e) => {setEmail(e.target.value);validateQmail(e.target.value);}}
                    className="rounded-r pl-10 pr-2 bg-slate-900/50 border border-r border-slate-700 text-slate-100 placeholder:text-slate-500 w-full"
                    placeholder="you"/>
                  <span className="flex items-center px-3 rounded-r-md border border-l-0 border-slate-700 bg-slate-900/50 text-slate-400 text-sm">
                    @qmail.website
                  </span>
                </div>
              </div>
              {qmailError && <p className="mt-1 text-xs text-red-400">{qmailError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                    if (confirmPassword) {
                      validateConfirmPassword(confirmPassword);
                    }
                  }}
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-xs text-red-400">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(e.target.value);
                  }}
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPasswordError && <p className="mt-1 text-xs text-red-400">{confirmPasswordError}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-sky-400 hover:text-sky-300 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};