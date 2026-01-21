import { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function TeacherAttendance() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get("/academic/subjects");
            setSubjects(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFetchStudents = async () => {
        console.log("Load Students Clicked. Selected Subject ID:", selectedSubject);
        if (!selectedSubject) {
            toast.error("Please select a subject first");
            return;
        }
        setLoading(true);
        try {
            const subject = subjects.find(s => s._id === selectedSubject);
            console.log("Selected Subject Object:", subject);

            if (!subject) {
                console.error("Subject not found in list");
                return;
            }

            if (!subject.class || !subject.class._id) {
                console.error("Subject has no linked class:", subject);
                toast.error("Error: This subject is not linked to a valid class.");
                return;
            }

            console.log("Fetching students for Class ID:", subject.class._id);
            const res = await api.get(`/academic/classes/${subject.class._id}/students`);

            console.log("Students Fetched:", res.data.data);
            const studentList = res.data.data;
            setStudents(studentList);

            if (studentList.length === 0) {
                toast("No students found in this class", { icon: '⚠️' });
            }

            // Initialize attendance state
            const initial = {};
            studentList.forEach(s => {
                initial[s._id] = { status: "Present", remarks: "" };
            });
            setAttendance(initial);

        } catch (err) {
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const subject = subjects.find(s => s._id === selectedSubject);
            const formattedRecords = students.map(s => ({
                student: s._id,
                status: attendance[s._id].status,
                remarks: attendance[s._id].remarks
            }));

            await api.post("/attendance", {
                date,
                subject: selectedSubject,
                classId: subject.class._id,
                records: formattedRecords
            });
            toast.success("Attendance Marked Successfully");
            setStudents([]);
            setSelectedSubject("");
        } catch (err) {
            toast.error("Failed to submit attendance");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>

            <div className="bg-white p-6 rounded shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.code}) - {s.class?.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleFetchStudents} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500">Load Students</button>
                    </div>
                </div>
            </div>

            {students.length > 0 && (
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-500">{student.studentDetails?.rollNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            {['Present', 'Absent', 'Late', 'OnDuty'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setAttendance(prev => ({
                                                        ...prev,
                                                        [student._id]: { ...prev[student._id], status }
                                                    }))}
                                                    className={`px-3 py-1 rounded text-xs font-medium ${attendance[student._id]?.status === status
                                                        ? (status === 'Present' ? 'bg-green-100 text-green-800 ring-2 ring-green-500' :
                                                            status === 'Absent' ? 'bg-red-100 text-red-800 ring-2 ring-red-500' :
                                                                status === 'OnDuty' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' :
                                                                    'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500')
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="border rounded p-1 text-sm w-full"
                                            placeholder="Optional"
                                            value={attendance[student._id]?.remarks || ''}
                                            onChange={e => setAttendance(prev => ({
                                                ...prev,
                                                [student._id]: { ...prev[student._id], remarks: e.target.value }
                                            }))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t bg-gray-50 flex justify-end">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-500">Submit Attendance</button>
                    </div>
                </div>
            )}
        </div>
    );
}
