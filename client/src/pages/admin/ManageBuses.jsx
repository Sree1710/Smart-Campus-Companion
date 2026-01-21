import { useState, useEffect } from "react";
import axios from "axios";
import { Bus, Plus, Trash, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageBuses() {
    const [buses, setBuses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        busNumber: "",
        driverName: "",
        route: "",
        capacity: 40,
        deviceId: "" // optional for now
    });

    const fetchBuses = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/bus");
            setBuses(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch buses");
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/bus", formData);
            toast.success("Bus Created");
            setShowModal(false);
            setFormData({ busNumber: "", driverName: "", route: "", capacity: 40, deviceId: "" });
            fetchBuses();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create bus");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this bus?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/bus/${id}`);
            toast.success("Bus Deleted");
            fetchBuses();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete bus");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Buses</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Bus
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {buses.map((bus) => (
                            <tr key={bus._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.busNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.driverName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.route}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.capacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(bus._id)} className="text-red-600 hover:text-red-900">
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Add New Bus</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bus Number</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm ring-1 ring-gray-300"
                                    value={formData.busNumber}
                                    onChange={e => setFormData({ ...formData, busNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm ring-1 ring-gray-300"
                                    value={formData.driverName}
                                    onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Route</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm ring-1 ring-gray-300"
                                    value={formData.route}
                                    onChange={e => setFormData({ ...formData, route: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm ring-1 ring-gray-300"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Create Bus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
