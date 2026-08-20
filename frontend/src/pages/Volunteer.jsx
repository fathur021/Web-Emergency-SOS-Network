import { useOutletContext } from "react-router-dom";
import MapView from "../components/MapContainer";
import { useGetVolunteersQuery } from "../redux/api/sos.Api";

const Volunteer = () => {
  const { sosList } = useOutletContext();
  const { data: volunteersData } = useGetVolunteersQuery();

  // Ubah data SOS dari backend jadi format markers yang dimengerti MapView:
  // [ { id, lat, lng, title, desc, reporter }, ... ]
  const markers = sosList
    .filter((s) => s.latitude != null &&
                   s.longitude != null &&
                  (s.status ==='pending' || s.status === 'in_progress')
      )
    .map((s) => ({
      id: s._id,
      lat: s.latitude,
      lng: s.longitude,
      title: s.description || "Sinyal SOS Darurat",
      desc: s.description || "",
      reporter: s.userId?.nama || "Anonim",
    }));

  // Ubah data relawan jadi format markers:
  // [ { lat, lng, nama, locationName, radius }, ... ]
  const volunteerMarkers = (volunteersData?.data || [])
    .filter((v) => v.latitude != null && v.longitude != null)
    .map((v) => ({
      lat: v.latitude,
      lng: v.longitude,
      nama: v.nama,
      locationName: v.locationName || "",
      radius: v.radius || 5000,
    }));

  return (
    <>
      {/* Peta Radar SOS + Lokasi Relawan */}
      <div className="absolute inset-0 z-0">
        <MapView markers={markers} volunteers={volunteerMarkers} zoom={12} />
      </div>
    </>
  );
};

export default Volunteer;
