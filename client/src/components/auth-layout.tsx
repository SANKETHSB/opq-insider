import { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import opqLogo from "../assets/opq-logo.png";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image and Logo */}
      <div className="auth-container relative hidden md:flex md:w-1/2 bg-primary text-white p-12 flex-col justify-between">
        <div className="z-10 relative">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={opqLogo} 
              alt="OPQ Bootcamp" 
              className="h-16 w-auto"
            />
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="space-y-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold">Welcome to OPQInsider</h1>
            <p className="text-white/80">
              Connect with your college community, access resources, and stay updated with latest campus events.
            </p>
            
            {/* Features List */}
            <div className="mt-8 space-y-4">
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Personalized Experience</h3>
                  <p className="text-sm text-white/70">Tailored content based on your college and interests.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Campus Events</h3>
                  <p className="text-sm text-white/70">Stay updated with workshops, seminars and college festivals.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Study Resources</h3>
                  <p className="text-sm text-white/70">Access study materials, notes and past papers.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/70"></div>
        
        {/* Credit */}
        <div className="z-10 relative text-sm text-white/60 mt-auto">
          © 2023 OPQInsider. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Authentication Forms */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
        {children}
      </div>
    </div>
  );
}
