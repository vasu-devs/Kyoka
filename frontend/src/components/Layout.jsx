import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-cream-50 font-sans text-charcoal-900 selection:bg-gold-400 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-between px-8 md:px-16 h-24 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5' : 'bg-transparent'
          }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-charcoal-900 flex items-center justify-center">
            <span className="font-serif font-bold text-lg leading-none pt-1">K</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Kyoka</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {['Methodology', 'Case Studies', 'About'].map((item) => (
            <a key={item} href="#" className="text-xs uppercase tracking-[0.2em] font-medium text-charcoal-900/60 hover:text-charcoal-900 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <button className="text-xs uppercase tracking-[0.2em] font-bold border-b border-charcoal-900 pb-1 hover:text-gold-500 hover:border-gold-500 transition-all">
          Menu
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 md:px-12 container mx-auto max-w-7xl min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-charcoal-900/10 flex flex-col md:flex-row items-center justify-between px-12 text-[10px] uppercase tracking-[0.2em] text-charcoal-900/40">
        <span>© 2026 Kyoka Intelligence</span>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-charcoal-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-charcoal-900 transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
