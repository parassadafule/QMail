import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mock users data directly in the component
const mockUsers = [
  { Qmailid: "testuser1", password: "password123" },
  { Qmailid: "admin", password: "admin123" },
  { Qmailid: "demo", password: "demo123" }
];

export function LoginPage({ onNavigateToSignup }) {
  const [Qmailid, setQmailid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [QmailidError, setQmailidError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    let isValid = true;
    
    if (!Qmailid) {
      setQmailidError("Qmailid is required");
      isValid = false;
    } else {
      setQmailidError("");
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    if (isValid) {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Qmailid, password }), // Backend expects 'email'
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", data.email);

          // Redirect to dashboard or homepage
          navigate("/client"); // <-- Customize your route
        } else {
          setLoginError(data.message || "Login failed. Please check credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("Network error. Please try again later.");
      }
    }
  
  };

  // Demo login function
  const fillDemoCredentials = () => {
    setQmailid("demo");
    setPassword("demo123");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-4 overflow-auto">
      <div className="w-full max-w-md p-5">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-amber-100">Welcome Back</h1>
          <p className="text-gray-400">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loginError && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-2 rounded">
              {loginError}
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="Qmailid" className="text-gray-300">
              Qmailid
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="Qmailid"
                type="text"
                value={Qmailid}
                onChange={(e) => setQmailid(e.target.value)}
                placeholder="Enter your Qmailid"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-3 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {QmailidError && <p className="text-sm text-red-500">{QmailidError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-10 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full rounded-md bg-gray-700 py-3 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-2"
          >
            Use Demo Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">Test Accounts:</p>
          <div className="text-gray-500 text-sm mb-4">
            <p>Qmailid: testuser1 | Password: password123</p>
            <p>Qmailid: admin | Password: admin123</p>
            <p>Qmailid: demo | Password: demo123</p>
          </div>
          <button 
            onClick={onNavigateToSignup} 
            className="text-blue-400 hover:text-blue-300 focus:outline-none"
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignupPage({ onNavigateToLogin }) {
  const [Qmailid, setQmailid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [QmailidError, setQmailidError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupMessage, setSignupMessage] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation logic
    let isValid = true;
    
    if (!Qmailid) {
      setQmailidError("Qmailid is required");
      isValid = false;
    } else {
      setQmailidError("");
    }
    
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    
    if (isValid) {
      try {
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Qmailid,   
            email,
            password,
          }),
        });
        console.log("Request body:")
  
        const data = await response.json();
  
        if (response.ok) {
          setSignupMessage({ 
            type: "success", 
            message: "Account created successfully! You can now sign in." 
          });
  
          // Redirect to login after a short delay
          setTimeout(() => {
            onNavigateToLogin();
          }, 2000);
        } else {
          setSignupMessage({
            type: "error",
            message: data.message || "Something went wrong. Try again.",
          });
        }
      } catch (error) {
        console.error("Signup Error:", error);
        setSignupMessage({
          type: "error",
          message: "Network error. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-4 overflow-auto">
      <div className="w-full max-w-md p-5">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-amber-100">Create Account</h1>
          <p className="text-gray-400">Fill in the form to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {signupMessage.message && (
            <div className={`${
              signupMessage.type === "success" 
                ? "bg-green-500 bg-opacity-20 border border-green-500 text-green-100" 
                : "bg-red-500 bg-opacity-20 border border-red-500 text-red-100"
              } px-4 py-2 rounded`}
            >
              {signupMessage.message}
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="email" className="text-gray-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-3 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="Qmailid" className="text-gray-300">
              Qmailid
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="Qmailid"
                type="text"
                value={Qmailid}
                onChange={(e) => setQmailid(e.target.value)}
                placeholder="Enter your Qmailid"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-3 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {QmailidError && <p className="text-sm text-red-500">{QmailidError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-10 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-md border border-gray-700 bg-transparent py-3 pl-10 pr-10 text-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={onNavigateToLogin} 
            className="text-blue-400 hover:text-blue-300 focus:outline-none"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}