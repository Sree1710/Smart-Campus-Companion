import { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function ODRequests() {
    const [requests, setRequests] = useState([]);
    const { user } = useContext(AuthContext); // Get user for role check

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/od/pending");
            setRequests(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, status, remarks) => {
        try {
            await api.put(`/od/${id}`, { status, remarks });
            toast.success(`Request ${status}`);
            fetchRequests();
        } catch (err) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
                {user.role === 'admin' ? "View Duty Leave Requests" : "Pending Duty Leave Requests"}
            </h1>

            <div className="grid gap-6">
                {requests.length === 0 && <p className="text-gray-500">No pending requests.</p>}
                {requests.map(req => (
                    <div key={req._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold">{req.student?.name} <span className="text-sm font-normal text-gray-500">({req.student?.studentDetails?.rollNumber || 'No Roll'})</span></h3>
                                <p className="text-indigo-600 font-medium">{req.title} <span className="text-gray-400 text-xs px-2 border rounded ml-2">{req.type}</span></p>
                                <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                                <p className="text-sm text-gray-500 mt-2 font-mono">
                                    {new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}
                                </p>
                                {req.proofUrl && (
                                    <a href={req.proofUrl} target="_blank" rel="noreferrer" className="text-blue-500 text-sm underline mt-2 block">View Proof</a>
                                )}
                            </div>
                            {/* Only show actions if Teacher */}
                            {user.role === 'teacher' && (
                                <div className="flex flex-col space-y-2">
                                    <button onClick={() => handleAction(req._id, 'Approved', 'Approved by Teacher')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-sm">Approve</button>
                                    <button onClick={() => {
                                        const reason = prompt("Reason for rejection:");
                                        if (reason) handleAction(req._id, 'Rejected', reason);
                                    }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 text-sm">Reject</button>
                                </div>
                            )}
                            {user.role === 'admin' && (
                                <div className="flex flex-col space-y-2">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded">View Only</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
