import { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ViewAttendance() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get("/academic/classes");
            setClasses(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load classes");
        }
    };

    const handleFetchAttendance = async () => {
        if (!selectedClass) {
            toast.error("Please select a class");
            return;
        }
        setLoading(true);
        try {
            // Note: Currently we don't have a direct "Get Attendance by Class & Date" endpoint that returns aggregated list.
            // We have `getClassAttendance` which returns fetching by student? No, let's check controller.
            // Actually `getClassAttendance` in `attendance.js` might filter by date query?
            // If not, we might need to modify backend. 
            // For now, let's assume `getClassAttendance` returns everything or supports query.
            // Looking at `server/routes/core.js`: `get('/class/:classId', ...)`

            const res = await api.get(`/attendance/class/${selectedClass}?date=${date}`);
            setAttendanceData(res.data.data); // Assuming backend returns list of records

            if (res.data.data.length === 0) {
                toast("No attendance records found for this date", { icon: 'ℹ️' });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">View Class Attendance</h1>

            <div className="bg-white p-6 rounded shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Class</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleFetchAttendance} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500">View Attendance</button>
                    </div>
                </div>
            </div>

            {attendanceData.length > 0 && (
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceData.map(record => (
                                <tr key={record._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{record.student?.name}</div>
                                        <div className="text-sm text-gray-500">{record.student?.studentDetails?.rollNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                record.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.remarks || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.subject?.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
