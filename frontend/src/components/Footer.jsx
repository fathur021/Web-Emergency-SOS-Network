import { PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-5 md:right-5 z-30">
      <div className="flex justify-between items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md bg-surface/75 border border-stone-200/80 shadow-neo text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-red-400" />
          Panggilan Darurat: <strong className="text-stone-800">112</strong>
        </span>
        <span>SOS Network v1.0</span>
      </div>
    </footer>
  );
};

export default Footer;