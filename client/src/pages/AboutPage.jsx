export default function AboutPage() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[85vw] max-w-4xl">
        <div className="px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            About <span className="text-blue-600">AiAnalyst</span>
          </h1>

          <p className="text-gray-800 text-lg leading-relaxed text-left mb-6">
            <strong>AiAnalyst</strong> is an AI-powered platform designed to
            help startups, marketers, and analysts transform raw CSV data into
            clear, actionable insights — instantly. Whether you're{" "}
            <em>validating a product</em>,{" "}
            <em>refining your target audience</em>, or{" "}
            <em>presenting to stakeholders</em>, AiAnalyst turns messy datasets
            into structured summaries, visualizations, and intelligent insights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-left">
            🔧 Built with the MERN Stack & OpenAI API
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed text-left mb-6">
            This project was crafted as part of a full-stack development journey
            using the <strong>MERN stack</strong> (MongoDB, Express, React, and
            Node.js). It features:
          </p>
          <ul className="list-disc pl-6 text-left text-gray-700 text-lg mb-6 space-y-2">
            <li>⚡ AI integration for natural-language data summaries</li>
            <li>🔐 Secure authentication & role-based access</li>
            <li>📊 Dynamic data visualizations and charts</li>
            <li>💡 CSV upload and automatic data cleaning</li>
            <li>📱 Responsive, minimal UI design for clarity</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-left">
            🎯 Why It Exists
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed text-left mb-6">
            Most business intelligence tools are either too complex or too
            expensive for early-stage teams. AiAnalyst aims to change that by
            making powerful analytics accessible to everyone —{" "}
            <strong>no technical background required</strong>.
          </p>

          <p className="text-gray-600 mt-8 text-sm italic text-left">
            Built with curiosity, care, and a love for clean, helpful tools.{" "}
            <br />
            Feedback and collaboration are always welcome.
          </p>
        </div>
      </div>
    </div>
  );
}
