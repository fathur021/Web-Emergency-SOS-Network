import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200/80 bg-surface/70 backdrop-blur flex justify-between items-center text-xs text-stone-500 z-30">
      <span className="flex items-center gap-1.5">
        <PhoneCall className="w-3.5 h-3.5 text-red-400" />
        Panggilan Darurat: <strong className="text-stone-800">112</strong>
      </span>
      <span>SOS Network v1.0</span>
    </footer>
  );
};

export default Footer;