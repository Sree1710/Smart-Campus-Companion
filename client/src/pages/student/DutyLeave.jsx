import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Calendar, Clock } from "lucide-react";

export default function DutyLeave() {
    const [ods, setOds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        type: "Internal",
        fromDate: "",
        toDate: "",
        reason: "",
        proofUrl: ""
    });

    useEffect(() => {
        fetchODs();
    }, []);

    const fetchODs = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/od/my");
            setOds(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/od", formData);
            toast.success("OD Request Submitted");
            setShowModal(false);
            fetchODs();
            setFormData({ title: "", type: "Internal", fromDate: "", toDate: "", reason: "", proofUrl: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit OD");
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-800",
            Approved: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
        };
        return (
            <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Duty Leave Requests</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ods.map((od) => (
                    <div key={od._id} className="relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${od.type === 'Internal' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {od.type}
                            </span>
                            {getStatusBadge(od.status)}
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">{od.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{od.description}</p>

                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{new Date(od.fromDate).toLocaleDateString()} - {new Date(od.toDate).toLocaleDateString()}</span>
                        </div>

                        {od.teacherRemarks && (
                            <div className="mt-4 rounded bg-gray-50 p-3 text-xs text-gray-600">
                                <span className="font-semibold">Teacher:</span> {od.teacherRemarks}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Apply for Duty Leave</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Internal</option>
                                    <option>External</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">From</label>
                                    <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        value={formData.fromDate} onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">To</label>
                                    <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        value={formData.toDate} onChange={e => setFormData({ ...formData, toDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Reason</label>
                                <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
