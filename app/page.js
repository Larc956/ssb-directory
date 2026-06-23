'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map so it only loads on the client side
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const [maxBudget, setMaxBudget] = useState(500);

    return (
        <main className="flex flex-col h-screen bg-[#F8F9FA] font-sans">
            {/* SSB Branded Header */}
            <header className="p-5 bg-[#0A3B7C] text-white shadow-md z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-wide">
                        SSB <span className="text-[#F4C114]">One-Stop Directory</span>
                    </h1>
                    <p className="text-sm opacity-80 mt-1">Notary Publics around Katipunan</p>
                </div>
                
                {/* Control Panel */}
                <div className="flex flex-col gap-2 bg-white/10 p-3 rounded-lg border border-white/20">
                    <label htmlFor="budget" className="text-sm font-semibold tracking-wide">
                        Max Budget: <span className="text-[#F4C114]">₱{maxBudget}</span>
                    </label>
                    <input 
                        id="budget"
                        type="range" 
                        min="50" max="500" step="10" 
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="accent-[#F4C114] cursor-pointer w-48"
                    />
                </div>
            </header>

            {/* Map Area */}
            <div className="flex-grow w-full relative">
                <Map maxBudget={maxBudget} />
            </div>
        </main>
    );
}