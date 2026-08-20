import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MapView from '../components/MapContainer';

const AdminDashboard = () => {
  const { incidents, volunteers } = useOutletContext();

  return (
    <>
      {/* Live Incident Feed Panel */}
      <section className="w-full md:w-80 border-r border-stone-200 bg-surface/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Incident Feed</h3>
          <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-mono">Real-time</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {incidents.map((item) => (
            <div 
              key={item.id} 
              className={`p-3.5 rounded-xl border space-y-2 transition cursor-pointer hover:border-stone-300 ${
                item.status === 'Pending'
                  ? 'bg-red-500/10 border-red-400/40'
                  : item.status === 'In Progress'
                  ? 'bg-surface border-stone-200 shadow-neo-sm'
                  : 'bg-surface/60 border-stone-200/70 opacity-60 shadow-neo-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                  item.status === 'Pending' 
                    ? 'bg-red-500 text-white' 
                    : item.status === 'In Progress'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-400/40'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {item.status}
                </span>
                <span className="text-[10px] text-stone-500">{item.time}</span>
              </div>

              <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
              <p className="text-xs text-stone-500">{item.location}</p>
              <p className="text-[11px] text-stone-400 line-clamp-2">"{item.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map View */}
      <section className="flex-1 relative bg-stone-100 hidden md:block">
        <MapView
          volunteers={volunteers || []}
          markers={incidents
            .filter((item) => item.location.startsWith('Lat: '))
            .filter((item)=> item.status === 'Pending' || item.status === 'In Progress')
            .map((item) => {
              const parts = item.location.replace('Lat: ', '').split(', Lng: ');
              return {
                id: item.id,
                lat: parseFloat(parts[0]),
                lng: parseFloat(parts[1]),
                title: item.title,
                desc: item.desc,
                reporter: item.reporter,
              };
            })}
        />
      </section>
    </>
  );
};

export default AdminDashboard;
