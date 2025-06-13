import { Link } from "react-router-dom";
export default function WelcomePage() {
  //thank you for registering,
  //Get started by uploading a new project here Link
  return (
    <div className="bg-white max-w-md mx-auto mt-16 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Welcome!</h2>
      <p className="text-gray-700 mb-4 text-center">
        Thank you for registering. Get started by uploading a new project.
      </p>
      <div className="flex justify-center">
        <Link
          to="/upload"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Project
        </Link>
      </div>
    </div>
  );
}
