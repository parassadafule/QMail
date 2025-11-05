import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const LoginPage = ({ onNavigateToSignup, onLoginSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

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
      const response = await fetch("http://localhost:5000/login", {  //(http://localhost:5000/login)
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
        localStorage.setItem("userName", data.fullName);
        // console.log(data.qmail);
        if (onLoginSuccess) onLoginSuccess();
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

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        navigate('/inbox');
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-background backdrop-blur-sm rounded-xl shadow-xl border">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-card-foreground">Welcome Back</h2>
          <p className="mt-2 text-sm text">Sign in to access your mails</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qmail" className="text">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="qmail"
                  name="qmail"
                  type="text"
                  autoComplete="qmail"
                  required
                  value={qmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-input text-foreground placeholder:text"
                  placeholder="you@qmail.website"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-input text-foreground placeholder:text"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text hover:text-foreground"
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
            className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-medium text-primary hover:text-primary/90 focus:outline-none focus:underline transition ease-in-out duration-150"
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

    const fullQmail = `${qmail}@qmail.website`;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          qmail: fullQmail,
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
      <div className="w-full max-w-lg p-8 space-y-8 bg-card backdrop-blur-sm rounded-xl shadow-xl border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground">Create your Account</h2>
          <p className="mt-2 text-sm text">Join us to experience secure communication</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setfullName(e.target.value);
                    validatefullName(e.target.value);
                  }}
                  className={`pl-10 bg-input border-input text-foreground placeholder:text ${fullNameError ? 'border-destructive' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {fullNameError && <p className="text-xs text-destructive">{fullNameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="qmail" className="text">Qmail ID</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="qmail"
                  name="qmail"
                  type="text"
                  autoComplete="email"
                  required
                  value={qmail}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateQmail(e.target.value);
                  }}
                  className={`pl-10 pr-28 bg-input border-input text-foreground placeholder:text ${qmailError ? 'border-destructive' : ''}`}
                  placeholder="your-unique-id"
                />
                <span className="absolute right-3 text-sm text">@qmail.website</span>
              </div>
              {qmailError && <p className="text-xs text-destructive">{qmailError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-signup" className="text">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="password-signup"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`pl-10 pr-10 bg-input border-input text-foreground placeholder:text ${passwordError ? 'border-destructive' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(e.target.value);
                  }}
                  className={`pl-10 pr-10 bg-input border-input text-foreground placeholder:text ${confirmPasswordError ? 'border-destructive' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-xs text-destructive">{confirmPasswordError}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Creating Account..." : "Sign up"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-primary hover:text-primary/90 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};