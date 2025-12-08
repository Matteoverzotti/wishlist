import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapProps } from '../../types';

const BucharestMap: React.FC<MapProps> = ({ locations }) => {
    const center: [number, number] = [44.4268, 26.1025];

    return (
        <MapContainer 
            center={center} 
            zoom={13} 
            className="leaflet-container w-full h-screen"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {locations.map((location) => (
                <Marker 
                    key={location.id} 
                    position={[location.lat, location.lng]}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-semibold text-gray-800">{location.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                            <div className="text-xs text-gray-500 mt-2">
                                Coordinates: {location.lat}, {location.lng}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default BucharestMap;