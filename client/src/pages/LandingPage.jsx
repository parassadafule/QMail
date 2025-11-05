import React, { useState, useEffect } from "react";
import { CgLogIn } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

const LandingPage = () => {
  const navigate = useNavigate();
  const [setScrollY] = useState(0);

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl" />
        </div>
        <div className="grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] h-full w-full opacity-[0.15]">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="col-span-1 row-span-1 border-t border-l border-border/50"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 border-b backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary"
              >
                <div className="w-4 h-4 text-primary-foreground">
                  <Rocket />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">QMAIL</span>
            </div>
           
            <div className="flex items-center gap-4">
            <ThemeToggle />
              <Button
              variant="outline"
              onClick={() => navigate('/signup')}>
              Get Started
            </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fadeIn opacity-0">
              {/* <div className="inline-block mb-6 px-4 py-1 rounded-full bg-muted/50 border backdrop-blur-md">
                <span className="text-sm font-medium text-primary">
                  Team VibeCoders
                </span>
              </div> */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Quantum Secure
                <br />
                E-mail Client
              </h1>
              <p className="text-lg md:text-xl text mb-8 max-w-2xl mx-auto">
                A next-gen email client secured with quantum encryption.
                Experience future-proof communication with layered protection
                and privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                  onClick={() => navigate('/login')}>
                  Welcome back
                  <CgLogIn />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/signup')}>
                  First time ? Sign up
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        {/* <footer
          className="py-12 border-t backdrop-blur-md bg-gradient-to-r from-primary/5 via-background to-secondary/5">
          <div className="container w-screen mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
              <div>
                <p className="text mb-4">
                  Team VibeCoders...
                  <br />
                  -Atharavraj Dhumal <br /> -Paras Sadafule <br /> -Yashraj
                  Sargam <br />
                  Computer Science Engineering, Third Year
                </p>
              </div>
            </div>

            <div className="  flex flex-col md:flex-row justify-between items-center">
              <p className="text text-sm">
                -Nagesh Karajgi Orchid College Of Engineering & Technology,
                Solapur.
              </p>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}

export default LandingPage;