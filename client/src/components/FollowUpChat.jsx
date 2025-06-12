import { useState } from "react";
import projectsService from "../services/projectsService";

export default function FollowUpChat({ projectId, summary }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await projectsService.askQuestion(projectId, question);
      setAnswer(res.answer);
    } catch (err) {
      console.error("Failed to get answer:", err);
      setAnswer("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-2">
        Have a question about the summary?
      </h3>
      <form onSubmit={handleAsk} className="flex flex-col gap-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something like: 'Which lead source performed best?'"
          className="border p-2 rounded w-full resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-4 bg-black p-4 border rounded shadow-sm">
          <h4 className="font-semibold mb-1">AI Response:</h4>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
