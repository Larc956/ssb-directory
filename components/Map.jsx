'use client';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 1. Haversine Formula: Calculates real-world distance in meters between two GPS coordinates
function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 2. Helper component to auto-pan the map when the user clicks "Find Me"
function AutoPanToUser({ userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (userLocation) {
            map.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true });
        }
    }, [userLocation, map]);
    return null;
}

export default function Map({ maxBudget, userLocation }) {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        (async function init() {
            const L = await import('leaflet');
            
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            const res = await fetch('/notary_directory.json');
            const data = await res.json();
            setLocations(data);
        })();
    }, []);

    const filteredLocations = locations.filter(loc => loc.price <= maxBudget);

    return (
        <MapContainer center={[14.6393, 121.0773]} zoom={15} style={{ height: '85vh', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* Auto-pan logic */}
            <AutoPanToUser userLocation={userLocation} />

            {/* Draw the User's "Blue Dot" if location is known */}
            {userLocation && (
                <CircleMarker 
                    center={[userLocation.lat, userLocation.lng]} 
                    radius={8} 
                    pathOptions={{ color: 'white', fillColor: '#2563EB', fillOpacity: 1, weight: 3 }}
                >
                    <Popup><strong>You are here</strong></Popup>
                </CircleMarker>
            )}
            
            {/* Draw the Notary Markers */}
            {filteredLocations.map((loc, index) => {
                if (!loc.latitude || !loc.longitude) return null; 

                // 3. Dynamic Distance Calculation
                let distanceText = loc.walk || 'N/A';
                
                if (userLocation) {
                    const meters = getDistanceMeters(userLocation.lat, userLocation.lng, loc.latitude, loc.longitude);
                    // Average walking speed is ~80 meters per minute
                    const walkMinutes = Math.ceil(meters / 80); 
                    
                    if (meters < 1000) {
                        distanceText = `${Math.round(meters)} meters away (~${walkMinutes} min walk)`;
                    } else {
                        const km = (meters / 1000).toFixed(1);
                        distanceText = `${km} km away (Requires commute)`;
                    }
                }

                return (
                    <Marker key={index} position={[loc.latitude, loc.longitude]}>
                        <Popup className="custom-popup">
                            <div className="w-64 max-h-[300px] overflow-y-auto pr-2">
                                <h3 className="font-bold text-[#0A3B7C] m-0 text-lg leading-tight mb-1">{loc.name}</h3>
                                <p className="text-xs text-gray-500 italic mb-3">{loc.address}</p>

                                <div className="text-sm space-y-2 text-gray-700">
                                    {/* Core Details */}
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <p><strong>Fee:</strong> {loc.price_range_text}</p>
                                        <p><strong>Hours:</strong> {loc.operating_hours}</p>
                                        <p><strong>Distance:</strong> {distanceText}</p>
                                    </div>

                                    {/* Student & Payment Info */}
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {loc.student_discount && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                                                ✓ Student Discount
                                            </span>
                                        )}
                                        {loc.details.payment_methods.gcash && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
                                                GCash Accepted
                                            </span>
                                        )}
                                    </div>

                                    {/* Contact & Extra Details */}
                                    {(loc.details.contact || loc.details.facebook) && (
                                        <div className="pt-2 border-t border-gray-200 mt-2">
                                            <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-1">Contact</p>
                                            {loc.details.contact && <p className="text-xs">📞 {loc.details.contact}</p>}
                                            {loc.details.facebook && <p className="text-xs text-blue-600 truncate">🌐 {loc.details.facebook}</p>}
                                        </div>
                                    )}

                                    {/* Scholar Feedback */}
                                    {loc.details.feedback && (
                                        <div className="mt-2 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                                            <p className="font-semibold text-xs text-[#0A3B7C] mb-1">💬 Scholar Feedback:</p>
                                            <p className="text-xs italic text-gray-600 line-clamp-3">"{loc.details.feedback}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}