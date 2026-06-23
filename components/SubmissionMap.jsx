'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function SubmissionMap({ onLocationChange }) {
    const [position, setPosition] = useState([14.6393, 121.0773]); // Ateneo center

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                onLocationChange([e.latlng.lat, e.latlng.lng]);
            },
        });

        return (
            <Marker 
                draggable={true} 
                position={position}
                eventHandlers={{
                    dragend: (e) => {
                        const pos = e.target.getLatLng();
                        setPosition([pos.lat, pos.lng]);
                        onLocationChange([pos.lat, pos.lng]);
                    }
                }}
            />
        );
    }

    return (
        <MapContainer center={position} zoom={16} className="h-[300px] w-full rounded-lg">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <LocationMarker />
        </MapContainer>
    );
}