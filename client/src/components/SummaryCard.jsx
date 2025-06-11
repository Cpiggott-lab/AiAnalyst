export default function SummaryCard({ summary, loading }) {
  return (
    <div className="mb-8 mt-8 p-4 border rounded-lg bg-gray-50">
      <h2 className="flex justify-center text-xl font-semibold mb-2">
        Summary
      </h2>
      {loading ? (
        <div>Loading summary...</div>
      ) : (
        <p className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {summary || "Pending summary generation."}
        </p>
      )}
    </div>
  );
}
