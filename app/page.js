'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const [maxBudget, setMaxBudget] = useState(500);
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    // The function to trigger the browser's GPS
    const locateUser = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setIsLocating(false);
                },
                (error) => {
                    alert("Could not access location. Please allow location permissions in your browser.");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsLocating(false);
        }
    };

    return (
        <main className="flex flex-col h-screen bg-[#F8F9FA] font-sans">
            <header className="p-5 bg-[#0A3B7C] text-white shadow-md z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-wide">
                        SSB <span className="text-[#F4C114]">One-Stop Directory</span>
                    </h1>
                    <p className="text-sm opacity-80 mt-1">Notary Publics around Katipunan</p>
                </div>
                
                {/* Control Panel */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* NEW: Find Me Button */}
                    <button 
                        onClick={locateUser}
                        disabled={isLocating}
                        className="bg-[#F4C114] text-[#0A3B7C] px-4 py-2 rounded-md font-bold shadow-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {isLocating ? "Locating..." : "📍 Find My Location"}
                    </button>

                    <div className="flex flex-col gap-1 bg-white/10 p-2 px-4 rounded-lg border border-white/20">
                        <label htmlFor="budget" className="text-sm font-semibold tracking-wide">
                            Max Budget: <span className="text-[#F4C114]">₱{maxBudget}</span>
                        </label>
                        <input 
                            id="budget"
                            type="range" 
                            min="50" max="1000" step="10" 
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="accent-[#F4C114] cursor-pointer w-32 md:w-48"
                        />
                    </div>
                </div>
            </header>

            <div className="flex-grow w-full relative">
                {/* Pass the new userLocation down to the map */}
                <Map maxBudget={maxBudget} userLocation={userLocation} />
            </div>
        </main>
    );
}