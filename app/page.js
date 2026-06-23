'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SubmissionForm from '../components/SubmissionForm';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const [maxBudget, setMaxBudget] = useState(500);
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

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
                () => {
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
                
                <div className="flex flex-wrap items-center gap-4">
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

            <div className="flex-grow w-full relative flex flex-col md:flex-row">
                <div className="w-full md:w-3/4 h-[70vh] md:h-full">
                    <Map maxBudget={maxBudget} userLocation={userLocation} />
                </div>
                <div className="w-full md:w-1/4 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                    <SubmissionForm />
                </div>
            </div>
        </main>
    );
}