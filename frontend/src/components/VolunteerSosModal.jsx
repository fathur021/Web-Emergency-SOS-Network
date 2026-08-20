import { Siren, MapPin, Check, X, AlertTriangle } from 'lucide-react';

const VolunteerSosModal = ({ sosData, onAccept, onReject }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-80 z-20">
      <div className="bg-surface/95 backdrop-blur-xl border border-red-400/30 rounded-2xl shadow-neo overflow-hidden">
        <div className="bg-red-500/10 border-b border-red-400/30 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center shrink-0">
            <Siren className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              SOS Masuk #{sosData.id}
            </p>
            <p className="text-xs text-stone-600 truncate">Butuh pertolongan segera</p>
          </div>
          <button onClick={onReject} className="ml-auto text-stone-500 hover:text-stone-900 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">{sosData.title}</h3>
            <p className="text-xs text-stone-500 mt-0.5 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>{sosData.location}</span>
            </p>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{sosData.description}</span>
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onAccept}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              TERIMA
            </button>
            <button
              onClick={onReject}
              className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-600 rounded-xl shadow-neo-sm font-bold text-xs transition border border-stone-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              TOLAK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSosModal;