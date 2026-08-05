import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur flex justify-between items-center text-xs text-slate-400 z-30">
      <span className="flex items-center gap-1.5">
        <PhoneCall className="w-3.5 h-3.5 text-red-400" />
        Panggilan Darurat: <strong className="text-slate-200">112</strong>
      </span>
      <span>SOS Network v1.0</span>
    </footer>
  );
};

export default Footer;