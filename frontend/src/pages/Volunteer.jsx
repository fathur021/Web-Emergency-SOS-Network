import React from 'react';
import MapView from '../components/MapContainer';

const Volunteer = () => {
  return (
    <>
      {/* Peta Radar SOS */}
      <div className="absolute inset-0">
        <MapView />
      </div>
    </>
  );
};

export default Volunteer;
