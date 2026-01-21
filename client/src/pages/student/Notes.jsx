import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pin, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", color: "#ffffff", isPinned: false });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/notes");
            setNotes(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/notes", formData);
            toast.success("Note created");
            setShowModal(false);
            fetchNotes();
            setFormData({ title: "", content: "", color: "#ffffff", isPinned: false });
        } catch (err) {
            toast.error("Failed to create note");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this note?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`);
            toast.success("Note deleted");
            fetchNotes();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {notes.map((note) => (
                    <div
                        key={note._id}
                        className="relative flex flex-col justify-between overflow-hidden rounded-lg p-5 shadow-sm border transition-shadow hover:shadow-md h-60"
                        style={{ backgroundColor: note.color }} // Ideally use predefined pastel palette classes rather than raw hex for better UI
                    >
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900 line-clamp-1">{note.title}</h3>
                                {note.isPinned && <Pin className="h-4 w-4 text-gray-600 fill-current" />}
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{note.content}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => handleDelete(note._id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">New Note</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full border-none p-0 text-lg font-semibold placeholder:text-gray-400 focus:ring-0"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <textarea placeholder="Take a note..." required className="w-full border-none p-0 text-gray-600 resize-none focus:ring-0 h-32"
                                value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                            />
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex space-x-2">
                                    <label className="flex items-center space-x-1 text-xs text-gray-500">
                                        <input type="checkbox" checked={formData.isPinned} onChange={e => setFormData({ ...formData, isPinned: e.target.checked })} />
                                        <span>Pin</span>
                                    </label>
                                    {/* Simple color picker */}
                                    <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="h-6 w-6 rounded-full overflow-hidden border-0 p-0" />
                                </div>
                                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
