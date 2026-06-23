'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Create custom icons for status
const greenIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', iconSize: [25, 41] });
const redIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });

export default function AdminMap({ locations, onDragEnd }) {
    return (
        <MapContainer center={[14.6393, 121.0773]} zoom={15} className="h-[500px] w-full shadow-lg rounded-xl">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {locations.map((loc) => (
                <Marker 
                    key={loc.id} 
                    position={[loc.latitude, loc.longitude]}
                    icon={loc.status === 'APPROVED' ? greenIcon : redIcon}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => onDragEnd(loc.id, e.target.getLatLng())
                    }}
                >
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-[#0A3B7C]">{loc.name}</h3>
                            <p className="text-xs">{loc.status}</p>
                            <button className="bg-red-500 text-white p-1 text-xs mt-2 rounded">Delete</button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}