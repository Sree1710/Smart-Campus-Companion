import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

export default function Notices() {
    const [notices, setNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", category: "General" });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/notices");
            setNotices(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/notices", formData);
            toast.success("Notice Posted");
            setShowModal(false);
            fetchNotices();
            setFormData({ title: "", content: "", category: "General" });
        } catch (err) {
            toast.error("Failed to post notice");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notices Board</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Post Notice
                </button>
            </div>

            <div className="space-y-4">
                {notices.map((notice) => (
                    <div key={notice._id} className="bg-white p-6 rounded shadow border-l-4 border-indigo-500">
                        <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold uppercase mt-1">{notice.category}</p>
                        <p className="mt-3 text-gray-700 whitespace-pre-wrap">{notice.content}</p>
                        <p className="text-xs text-gray-400 mt-4 text-right">Posted by: {notice.postedBy?.name}</p>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Post New Notice</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full border rounded p-2"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <select className="w-full border rounded p-2"
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>General</option>
                                <option>Academic</option>
                                <option>Event</option>
                            </select>
                            <textarea placeholder="Content..." required className="w-full border rounded p-2 h-32"
                                value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                            />
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Post Notice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
