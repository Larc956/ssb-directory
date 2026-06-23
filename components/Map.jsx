'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ maxBudget }) {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // 1. We dynamically import Leaflet ONLY on the client side to avoid the 'window' error
        (async function init() {
            const L = await import('leaflet');
            
            // Fix for missing marker icons in Next.js
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            // 2. Fetch your CSV-turned-JSON data
            const res = await fetch('/cleaned_notary_directory.json');
            const data = await res.json();
            setLocations(data);
        })();
    }, []);

    // Filter based on the slider value passed from page.js
    const filteredLocations = locations.filter(loc => loc.price <= maxBudget);

    return (
        <MapContainer center={[14.6393, 121.0773]} zoom={15} style={{ height: '85vh', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {filteredLocations.map((loc, index) => (
                <Marker key={index} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                        <h3 className="font-bold text-[#0A3B7C] m-0 text-lg">{loc.name}</h3>
                        <div className="mt-2 text-sm space-y-1 text-gray-700">
                            <p><strong>Price:</strong> ₱{loc.price}</p>
                            <p><strong>Hours:</strong> {loc.operating_hours}</p>
                            <p><strong>Est. Walk:</strong> {loc.walk || 'N/A'}</p>
                            {loc.student_discount && <p className="text-green-600 font-bold">Student Discount Available!</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}