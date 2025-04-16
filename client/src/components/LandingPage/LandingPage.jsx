import React, { useState, useEffect } from "react";
import { CgLogIn } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Rocket = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const Button = ({ children, className, variant, size, onClick }) => {
  const baseClass = "font-medium rounded-md transition-colors duration-200";
  const sizeClass = size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  const variantClass =
    variant === "outline"
      ? "border border-white/20 bg-transparent hover:bg-white/10 text-white"
      : "text-white shadow-sm";

  return (
    <button
      className={`${baseClass} ${sizeClass} ${variantClass} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};


export default function LandingPage() {
  const navigate = useNavigate();
  const [ setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Adding CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInFromLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInFromRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.6; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(30, 58, 138, 0.2), black, rgba(88, 28, 135, 0.2))",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full"
            style={{ filter: "blur(24px)" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full"
            style={{ filter: "blur(24px)" }}
          />
        </div>
        <div className="grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] h-full w-full opacity-[0.15]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="col-span-1 row-span-1 border-t border-l border-white/5"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 backdrop-grayscale backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                }}
              >
                <div className="w-4 h-4 text-white">
                  <Rocket />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">QMAIL</span>
            </div>
           
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10 hover:border-white/30"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-50">
          <div className="container mx-auto px-4">
            <div
              className="max-w-4xl mx-auto text-center"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                animation: "fadeIn 0.8s forwards",
              }}
            >
              <div className="inline-block mb-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-sm font-medium text-blue-400">
                  Team VibeCoders
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                style={{
                  background:
                    "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quantum Secure
                <br />
                E-mail Client
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                A next-gen email client secured with quantum encryption.
                Experience future-proof communication with layered protection
                and privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                  onClick={() => navigate('/login')}
                >
                  Welcome back
                  <CgLogIn />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => navigate('/signup')}
                >
                  First time ? Sign up
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-12 border-t border-white/10 backdrop-blur-md"
          style={{
            background:
              "linear-gradient(to right, rgba(30, 58, 138, 0.1), black, rgba(88, 28, 135, 0.1))",
          }}
        >
          <div className="container w-screen mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
              <div>
                <p className="text-white/70 mb-4">
                  {/* Pioneering the future of quantum computing technology for the
                  modern enterprise. */}
                  Team VibeCoders...
                  <br />
                  -Atharavraj Dhumal <br /> -Paras Sadafule <br /> -Yashraj
                  Sargam <br />
                  Computer Science Engineering, Third Year
                </p>
              </div>
            </div>

            <div className="  flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/70 text-sm">
                -Nagesh Karajgi Orchid College Of Engineering & Technology,
                Solapur.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
