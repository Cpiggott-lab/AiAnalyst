export default function AboutPage() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-[80vw]">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">About AiAnalyst</h1>

          <p className="mb-6 text-gray-800 text-lg leading-relaxed text-left">
            AiAnalyst is an AI-powered platform that helps startups, marketers,
            and analysts quickly turn raw data into clear, actionable insights.
            Whether you're validating a new product, refining your audience, or
            presenting to stakeholders, PersonaForge empowers you to transform
            complex CSV data into structured summaries, visualizations, and
            AI-generated insights — in seconds.
          </p>

          <p className="mb-6 text-gray-800 text-lg leading-relaxed text-left">
            This project was built as part of a full-stack development journey
            using the MERN stack (MongoDB, Express, React, and Node.js). It
            integrates AI for data summarization, a secure authentication
            system, and responsive, minimal design principles.
          </p>

          <p className="mb-6 text-gray-800 text-lg leading-relaxed text-left">
            The goal is to simplify business intelligence tools by making them
            accessible to non-technical users and efficient for developers and
            analysts alike.
          </p>

          <p className="text-gray-600 mt-6 text-sm italic text-left">
            Built with passion and curiosity. Feedback and collaboration are
            always welcome.
          </p>
        </div>
      </div>
    </div>
  );
}
