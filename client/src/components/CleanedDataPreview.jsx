export default function CleanedDataPreview({ cleanedData }) {
  if (!Array.isArray(cleanedData)) {
    return (
      <div className="mb-4">
        <h2 className="text-white flex justify-center text-xl font-semibold mb-2">
          Cleaned Data (Preview)
        </h2>
        <p className="text-center text-sm text-gray-600">No data to display.</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="text-white flex justify-center text-xl font-semibold mb-2">
        Cleaned Data (Preview)
      </h2>
      <pre className="bg-gray-800 text-white text-sm p-4 rounded overflow-y-scroll max-h-72 whitespace-pre-wrap">
        {JSON.stringify(cleanedData.slice(0, 5), null, 2)}
      </pre>
    </div>
  );
}
