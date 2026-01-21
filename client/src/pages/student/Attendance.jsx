import { useState, useEffect } from "react";
import api from "../../utils/api";
import { UserCheck, XCircle, AlertCircle } from "lucide-react";

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await api.get("/attendance/my");
            setAttendance(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Present": return "text-green-600 bg-green-50";
            case "Absent": return "text-red-600 bg-red-50";
            case "OnDuty": return "text-blue-600 bg-blue-50";
            case "Late": return "text-yellow-600 bg-yellow-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    if (loading) return <div className="p-8">Loading attendance records...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
                <div className="flex space-x-2 text-sm">
                    <span className="px-3 py-1 rounded bg-green-100 text-green-800">Present: {attendance.filter(r => r.status === 'Present').length}</span>
                    <span className="px-3 py-1 rounded bg-red-100 text-red-800">Absent: {attendance.filter(r => r.status === 'Absent').length}</span>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {attendance.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-500">No attendance records found.</li>
                    ) : (
                        attendance.map((record) => (
                            <li key={record._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="truncate text-sm font-medium text-indigo-600">{record.subject?.name || 'Unknown Subject'}</p>
                                        <p className="flex items-center text-sm text-gray-500">
                                            <span>{new Date(record.date).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </div>
                                </div>
                                {record.remarks && (
                                    <p className="mt-2 text-xs text-gray-400">Dim: {record.remarks}</p>
                                )}
                            </li>
                        )))}
                </ul>
            </div>
        </div>
    );
}
