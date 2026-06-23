'use client';
import { useState } from 'react';

export default function SubmissionForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        price: '',
        notes: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // In your MVP, this would send data to a Next.js API route or Django endpoint
        // For now, we simulate saving it to a "Pending" queue
        console.log("Saving to Pending Queue:", formData);
        
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', address: '', price: '', notes: '' });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-4 border-t-4 border-[#F4C114]">
            <h2 className="text-xl font-bold text-[#0A3B7C] mb-2">Suggest a Location</h2>
            <p className="text-sm text-gray-600 mb-4">Help fellow scholars by adding an affordable spot around Katipunan!</p>
            
            {submitted ? (
                <div className="bg-green-100 text-green-800 p-3 rounded text-center font-bold">
                    Thanks! The SSB team will review and add this shortly.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input 
                        required
                        type="text" 
                        placeholder="Location Name (e.g., Ate Jane's Printing)" 
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        required
                        type="text" 
                        placeholder="Full Street Address" 
                        className="w-full p-2 border rounded"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                    <input 
                        required
                        type="number" 
                        placeholder="Estimated Price (₱)" 
                        className="w-full p-2 border rounded"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                    <textarea 
                        placeholder="Any notes? (e.g., Offers student discount)" 
                        className="w-full p-2 border rounded"
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                    <button type="submit" className="w-full bg-[#0A3B7C] text-white p-2 rounded font-bold hover:bg-blue-800 transition">
                        Submit for Review
                    </button>
                </form>
            )}
        </div>
    );
}