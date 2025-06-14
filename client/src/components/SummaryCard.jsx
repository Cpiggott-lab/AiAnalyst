export default function SummaryCard({ summary, loading }) {
  return (
    <div className="mb-8 p-4 border rounded-b-lg bg-gray-50">
      {loading ? (
        <div>Loading summary...</div>
      ) : (
        <div
          className="whitespace-pre-wrap bg-gray-100 p-4 pt-0 rounded"
          // style={{ lineHeight: "1" }}
          dangerouslySetInnerHTML={{
            __html: summary || "",
          }}
        ></div>
      )}
    </div>
  );
}
