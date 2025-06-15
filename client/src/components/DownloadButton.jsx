export default function DownloadButton({
  data,
  filename = "cleaned_data.json",
}) {
  // Handles triggering a file download for the cleaned data
  const handleDownload = () => {
    if (!data) return;

    // Convert data to JSON and create a downloadable blob
    // blob is a built in feature for making a file in memory
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    // Create a temporary URL and anchor element to trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center mb-8">
      <button
        onClick={handleDownload}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download Full Cleaned Data
      </button>
    </div>
  );
}
