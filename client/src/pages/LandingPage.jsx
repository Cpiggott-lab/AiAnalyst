import BarChart from "../assets/Bar-Chart.png";
import PieChart from "../assets/Pie-Chart.png";
import LineChart from "../assets/Line-Chart.png";
import Banner from "../components/Banner";

export default function LandingPage() {
  return (
    <div className="bg-transparent flex flex-col items-center text-center">
      <Banner>
        <div className="flex flex-col items-center w-full px-4 space-y-16 pb-20">
          <section className="bg-transparent   rounded-lg shadow-md p-6 w-full max-w-screen-xl">
            <h2 className="text-white text-3xl font-bold mb-6 text-center">
              Instantly Clean Messy Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col">
                <h3 className="text-black text-left text-xl font-semibold mb-3">
                  Before (Messy Data)
                </h3>
                <pre className="bg-black text-red-500 rounded-lg p-4 text-lg font-mono text-left overflow-x-auto flex-1">
                  {`name, email, signup_date, age, country
John Doe, johndoe(at)email, 12/32/2022, 27, 
,  , 01/15/2023, , USA
Sarah, sarah@email.com, 2023-03-10,  , Germany
" Mike ", mike@email, March 5th, twenty-five, US
Ava Smith, ava@email, 2022/13/01, thirty, UK
Liam,,2023-02-30,,Canada
Emma Watson,emma@ email.com, 02-29-2023, twenty two,GB
,,2023-04-01,45,
Noah, noah@email.com, , , USA`}
                </pre>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col">
                <h3 className="text-left text-xl font-semibold text-gray-700 mb-3">
                  After (Cleaned Data)
                </h3>
                <pre className="bg-black text-green-500 rounded-lg p-4 text-lg font-mono text-left overflow-x-auto flex-1">
                  {`name, email, signup_date, age, country
John Doe, johndoe@email.com, 2022-12-31, 27, Unknown
Sarah, sarah@email.com, 2023-03-10, N/A, Germany
Mike, mike@email.com, 2023-03-05, 25, US
Ava Smith, ava@email.com, 2022-01-13, 30, UK
Liam, N/A, N/A, N/A, Canada
Emma Watson, emma@email.com, 2023-02-28, 22, GB
Unknown, N/A, 2023-04-01, 45, Unknown
Noah, noah@email.com, N/A, N/A, USA`}
                </pre>
              </div>
            </div>
          </section>

          <section className="bg-transparent rounded-lg shadow-md p-6 w-full max-w-screen-xl">
            <h2 className="text-white text-3xl font-bold mb-4 text-center">
              How It Works
            </h2>
            <div className="bg-transparent rounded-lg px-4 py-6 w-full">
              <ol className="flex flex-col md:flex-row justify-center items-center   gap-4 text-left text-xl">
                {[
                  "Upload your messy data file (CSV, Excel, JSON, etc.)",
                  "AI cleans and organizes your data automatically",
                  "Explore insights, charts, and actionable results",
                ].map((step, index) => (
                  <li
                    key={index}
                    className="flex gap-4 items-center justify-center bg-white border rounded-lg shadow-sm px-5 py-4 w-full max-w-sm text-black"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="bg-transparent rounded-lg shadow-md p-6 w-full max-w-screen-xl">
            <h2 className="text-white text-3xl font-bold mb-6 text-center">
              Instant Insights
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[BarChart, PieChart, LineChart].map((src, idx) => {
                const captions = [
                  "*Bar chart, auto-generated",
                  "*Pie chart for category distribution",
                  "*Line chart for trends over time",
                ];
                const alts = [
                  "Bar chart Age Distribution",
                  "Pie chart Country Breakdown",
                  "Line chart Signups Over Time",
                ];
                return (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded p-6 flex flex-col items-center"
                  >
                    <img
                      src={src}
                      alt={alts[idx]}
                      className="w-36 h-36 object-contain mb-2"
                      draggable="false"
                    />
                    <span className="text-sm text-gray-500">
                      {captions[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-transparent   rounded-lg shadow-md p-6 w-full max-w-screen-xl">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">
              No-Code Data Rules
            </h2>
            <div className="text-white flex flex-col gap-4 mx-auto max-w-md text-left text-lg">
              {[
                "Remove rows where email is missing",
                "Standardize date to YYYY-MM-DD",
                "Flag invalid ages",
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded mr-3 text-sm font-medium">
                    Rule {idx + 1}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: rule.replace(/(email|date|ages)/gi, "<b>$1</b>"),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </Banner>
    </div>
  );
}
