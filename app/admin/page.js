'use client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Inside your component:
const { data, error } = await supabase
  .from('notary_locations')
  .select('*')
  .eq('status', 'PENDING');

export default function AdminDashboard() {
    // In a real app, this data would be fetched from your Postgres Database
    const [pendingLocations, setPendingLocations] = useState([
        {
            id: 1, name: "Cheap Print Hub", address: "Fabian de la Rosa St", 
            latitude: 14.6393, longitude: 121.0773, price: 5, notes: "Black and white only"
        }
    ]);

    const handleApprove = async (id) => {
        // Here you would trigger an API route to update the status to 'APPROVED' in Postgres
        alert(`Approved location ID: ${id}`);
        setPendingLocations(pendingLocations.filter(loc => loc.id !== id));
    };

    const handleReject = async (id) => {
        // API route to delete or mark 'REJECTED'
        alert(`Rejected location ID: ${id}`);
        setPendingLocations(pendingLocations.filter(loc => loc.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-[#0A3B7C]">SSB Admin Portal</h1>
                <p className="text-gray-600">Review community submissions before they go live on the map.</p>
            </header>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0A3B7C] text-white">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Address</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Coordinates</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingLocations.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No pending submissions!</td></tr>
                        ) : pendingLocations.map((loc) => (
                            <tr key={loc.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-bold text-gray-800">{loc.name}
                                    <div className="text-xs font-normal text-gray-500 mt-1">Note: {loc.notes}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{loc.address}</td>
                                <td className="p-4 text-sm font-semibold text-green-700">₱{loc.price}</td>
                                <td className="p-4 text-xs text-gray-500">[{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}]</td>
                                <td className="p-4 flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleApprove(loc.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-bold text-sm transition">
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(loc.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold text-sm transition">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}