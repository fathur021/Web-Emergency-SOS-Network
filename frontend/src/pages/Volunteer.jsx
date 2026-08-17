import { useOutletContext } from 'react-router-dom';
import MapView from '../components/MapContainer';

const Volunteer = () => {
  const { sosList } = useOutletContext();
  // Ubah data SOS dari backend jadi format markers yang dimengerti MapView:
  // [ { id, lat, lng, title, desc, reporter }, ... ]
  const markers = sosList
    .filter((s) => s.latitude != null && s.longitude != null)
    .map((s) => ({
      id: s._id,
      lat: s.latitude,
      lng: s.longitude,
      title: s.description || "Sinyal SOS Darurat",
      desc: s.description || "",
      reporter: s.userId?.nama || "Anonim",
    }));
  return (
    <>
      {/* Peta Radar SOS */}
      <div className="absolute inset-0">
        <MapView  markers={markers} zoom={12}/>
      </div>
    </>
  );
};

export default Volunteer;
