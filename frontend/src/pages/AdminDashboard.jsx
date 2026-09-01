import { useOutletContext } from 'react-router-dom';
import MapView from '../components/MapContainer';
import { getImageUrl } from '../config/api';

const getTodayWIB = () =>{
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  return `${day}/${month}/${year}`;
}

const AdminDashboard = () => {
  const { incidents, volunteers } = useOutletContext();

  const todayStr = getTodayWIB();
  const todayIncidents = incidents.filter((item) => item.time.startsWith(todayStr));

  return (
    <>
      {/* Live Incident Feed Panel */}
      <section className="w-full md:w-80 border-r border-stone-200 bg-surface/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Incident Feed</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">Hari ini · {todayStr.replaceAll("/", "-")}</p>
          </div>
          <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-mono shrink-0">Real-time</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {todayIncidents.map((item) => (
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

              <div className="flex items-stretch gap-3">
                {/* FOTO SOS — thumbnail avatar di samping KIRI.
                    Hanya dirender kalau field image terisi (truthy). */}
                {item.image && (
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 self-center overflow-hidden rounded-xl border border-stone-200">
                    <img
                      src={getImageUrl(item.image)}
                      alt="Foto lokasi kejadian"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Kolom teks ringkas */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-stone-900 truncate">{item.title}</h4>
                  <p className="text-xs text-stone-500 truncate">{item.location}</p>
                  <p className="text-[11px] text-stone-400 line-clamp-2">"{item.desc}"</p>
                </div>
              </div>
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
