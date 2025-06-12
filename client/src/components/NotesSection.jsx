import { useState } from "react";
import projectsService from "../services/projectsService";

export default function NotesSection({ projectId, initialNotes = [] }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [noteSaving, setNoteSaving] = useState(false);

  const saveNote = async () => {
    if (!note.trim()) return;
    setNoteSaving(true);
    try {
      const result = await projectsService.updateNote(projectId, note);
      setNotes(result.notes);
      setNote("");
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note.");
    } finally {
      setNoteSaving(false);
    }
  };

  return (
    <div className="mb-10 mt-8 p-4 border rounded-lg bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="flex justify-center text-xl font-semibold mb-4 text-gray-800">
          Project Notes
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes or thoughts here..."
        />

        <button
          onClick={saveNote}
          disabled={noteSaving}
          className={`mt-4 w-full px-4 py-2 rounded text-white font-semibold ${
            noteSaving
              ? "bg-black"
              : "bg-black hover:bg-gray-700 transition-colors"
          }`}
        >
          {noteSaving ? "Saving..." : "Save Note"}
        </button>
        {notes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Previous Notes:
            </h3>
            <ul className="space-y-2">
              {notes.map((n, idx) => (
                <li key={idx} className="bg-gray-100 p-3 rounded text-sm">
                  <div className="text-gray-800">{n.text}</div>
                  {n.createdAt && (
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
