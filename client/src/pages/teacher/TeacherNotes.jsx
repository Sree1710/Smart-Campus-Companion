import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag, Calendar, BookOpen } from "lucide-react";

export default function TeacherNotes() {
    const [notes, setNotes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("assignment"); // assignment, lecture_note
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        fetchNotes();
        fetchClasses();
        fetchSubjects();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/notes");
            setNotes(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/academic/classes");
            setClasses(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/academic/subjects");
            setSubjects(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedClass) return toast.error("Please select a class");

            await axios.post("http://localhost:5001/api/notes", {
                title,
                content,
                type,
                classId: selectedClass,
                subjectId: selectedSubject || undefined,
                dueDate: dueDate || undefined,
                isPinned: true // Pin assignments by default? Optional.
            });

            toast.success("Created successfully");
            setShowForm(false);
            resetForm();
            fetchNotes();
        } catch (err) {
            toast.error("Failed to create");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`);
            toast.success("Deleted");
            fetchNotes();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setType("assignment");
        setSelectedClass("");
        setSelectedSubject("");
        setDueDate("");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Class Assignments & Notes</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow border border-indigo-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
                                    <option value="assignment">Assignment</option>
                                    <option value="lecture_note">Lecture Note</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Class</label>
                                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject (Optional)</label>
                                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            {type === 'assignment' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2" placeholder="e.g., Chapter 1 Homework" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content / Description</label>
                            <textarea required rows={4} value={content} onChange={e => setContent(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2" placeholder="Task details..." />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">Post</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <div key={note._id} className="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500 relative group">
                        <button onClick={() => handleDelete(note._id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${note.type === 'assignment' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'} font-semibold uppercase`}>
                                {note.type.replace('_', ' ')}
                            </span>
                            {note.subject && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{note.subject.name}</span>}
                        </div>

                        <h3 className="font-bold text-lg text-gray-900">{note.title}</h3>
                        <p className="text-gray-600 mt-2 text-sm whitespace-pre-wrap">{note.content}</p>

                        {note.dueDate && (
                            <div className="mt-4 flex items-center text-sm text-red-600">
                                <Calendar className="w-4 h-4 mr-1" />
                                Due: {new Date(note.dueDate).toLocaleDateString()}
                            </div>
                        )}

                        <div className="mt-4 text-xs text-gray-400 border-t pt-2">
                            Posted: {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
