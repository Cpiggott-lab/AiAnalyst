import { Link } from "react-router-dom";
import BarChart from "../assets/Bar-Chart.png";
import PieChart from "../assets/Pie-Chart.png";
import LineChart from "../assets/Line-Chart.png";

export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to your personal AiAnalyst
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        A smarter way to explore and analyze your data.
      </p>

      {isLoggedIn ? (
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-500 text-blue-500 px-6 py-3 rounded hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      )}

      <div className="mt-14 text-left">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Instantly Clean Messy Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className=" flex justify-center font-semibold text-gray-600 mb-1">
              Before (Messy Data)
            </h3>
            <pre className="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto">
              {`name, email, signup_date, age, country
John Doe, johndoe(at)email, 12/32/2022, 27, 
,  , 01/15/2023, , USA
Sarah, sarah@email.com, 2023-03-10,  , Germany
" Mike ", mike@email, March 5th, twenty-five, US`}
            </pre>
          </div>
          <div>
            <h3 className=" flex justify-center font-semibold text-gray-600 mb-1">
              After (Cleaned Data)
            </h3>
            <pre className="bg-gray-800 text-green-100 rounded p-4 text-xs overflow-x-auto">
              {`name, email, signup_date, age, country
John Doe, johndoe@email.com, 2022-12-31, 27, Unknown
Sarah, sarah@email.com, 2023-03-10, N/A, Germany
Mike, mike@email.com, 2023-03-05, 25, US`}
            </pre>
          </div>
        </div>
      </div>

      <div className="my-14">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="flex flex-col gap-6 md:flex-row md:gap-8 justify-center items-start text-left mx-auto max-w-2xl">
          <li className="flex row gap-3 justify-center align-middle">
            <span className="flex justify-center font-bold text-blue-500 text-3xl mb-2">
              1
            </span>
            <span>Upload your messy data file (CSV, Excel, JSON, etc.)</span>
          </li>
          <li className="flex row gap-3 justify-center align-middle">
            <span className="flex justify-center font-bold text-blue-500 text-3xl mb-2">
              2
            </span>
            <span>AI cleans and organizes your data automatically</span>
          </li>
          <li className="flex row gap-3 justify-center align-middle">
            <span className="flex justify-center font-bold text-blue-500 text-3xl mb-2">
              3
            </span>
            <span>Explore insights, charts, and actionable results</span>
          </li>
        </ol>
      </div>

      <div className="my-10">
        <h2 className="text-xl font-semibold mb-2">Instant Insights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded p-4 flex flex-col items-center">
            <img
              src={BarChart}
              alt="Bar chart Age Distribution"
              className="w-32 h-32 object-contain mb-1"
              draggable="false"
            />
            <span className="text-xs text-gray-400">
              *Bar chart, auto-generated
            </span>
          </div>
          <div className="bg-gray-100 rounded p-4 flex flex-col items-center">
            <img
              src={PieChart}
              alt="Pie chart Country Breakdown"
              className="w-32 h-32 object-contain mb-1"
              draggable="false"
            />
            <span className="text-xs text-gray-400">
              *Pie chart for category distribution
            </span>
          </div>
          <div className="bg-gray-100 rounded p-4 flex flex-col items-center">
            <img
              src={LineChart}
              alt="Line chart Signups Over Time"
              className="w-32 h-32 object-contain mb-1"
              draggable="false"
            />
            <span className="text-xs text-gray-400">
              *Line chart for trends over time
            </span>
          </div>
        </div>
      </div>

      <div className="my-12">
        <h2 className="text-xl font-semibold mb-2">No-Code Data Rules</h2>
        <div className="bg-white border rounded shadow p-4 flex flex-col gap-2 mx-auto max-w-sm">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2 text-xs">
              Rule 1
            </span>
            <span>
              Remove rows where <b>email</b> is missing
            </span>
          </div>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2 text-xs">
              Rule 2
            </span>
            <span>
              Standardize <b>date</b> to YYYY-MM-DD
            </span>
          </div>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2 text-xs">
              Rule 3
            </span>
            <span>Flag invalid ages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
