import React, { useState, useRef, useEffect } from 'react'; 
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Image, Mail, TreeDeciduous, Gamepad2, Star, Volume2, VolumeX } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isReading = location.pathname.startsWith('/chapter/');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (!isMuted) {
        audioRef.current.play().catch(() => setIsMuted(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  return (
    <div className="relative min-h-screen bg-charcoal overflow-hidden font-sans">
      <audio ref={audioRef} loop src="/bgm.mp3" />
      
      <button 
        onClick={() => setIsMuted(!isMuted)} 
        className="fixed top-6 right-6 z-50 bg-espresso/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white/50 hover:text-gold hover:border-gold/50 transition-all shadow-xl"
        title="Toggle Ambient Audio"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.4 } }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {!isReading && (
        <motion.nav 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-espresso/90 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex gap-8 items-center shadow-2xl"
        >
          <NavItem to="/archive" icon={<Map size={16} />} label="Archive" active={location.pathname === '/archive'} />
          <NavItem to="/gallery" icon={<Image size={16} />} label="Gallery" active={location.pathname === '/gallery'} />
          <NavItem to="/letters" icon={<Mail size={16} />} label="Letters" active={location.pathname === '/letters'} />
          <NavItem to="/garden" icon={<TreeDeciduous size={16} />} label="Garden" active={location.pathname === '/garden'} />
          <NavItem to="/arcade" icon={<Gamepad2 size={16} />} label="Arcade" active={location.pathname === '/arcade'} />
          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
          <NavItem to="/observatory" icon={<Star size={16} />} label="Finale" active={location.pathname === '/observatory'} special />
        </motion.nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, active, special }: { to: string, icon: React.ReactNode, label: string, active: boolean, special?: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? (special ? 'text-gold scale-110' : 'text-rose scale-110') : 'text-white/40 hover:text-white/80'}`}>
      {icon}
      <span className="text-[9px] uppercase tracking-widest">{label}</span>
    </Link>
  );
}