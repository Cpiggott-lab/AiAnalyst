const Project = require("../models/Project");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generates chart suggestions using OpenAI based on cleaned CSV data
exports.generateChartDataUniversal = async (req, res) => {
  try {
    // Find project by ID and make sure it belongs to the logged-in user
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized access" });

    // If chart data already exists, just return it to avoid duplicate work
    if (project.chartData && Object.keys(project.chartData).length > 0) {
      return res.json({ chartData: project.chartData });
    }

    // Create AI prompt asking for chart suggestions based on the dataset
    const chartPrompt = `
You are a data analyst. The user will upload a cleaned JSON or CSV table (e.g. sales, leads, countries, product surveys, etc).

Analyze the dataset below and return multiple appropriate chart definitions using this format:

{
  "recommendedCharts": [
    {
      "type": "bar",
      "title": "Top categories by count",
      "field": "<FIELD_NAME>",
      "data": [ { "label": "<Value>", "count": <N> }, ... ]
    },
    {
      "type": "pie",
      "title": "Share of <FIELD_NAME>",
      "field": "<FIELD_NAME>",
      "data": [ { "label": "<Value>", "count": <N> }, ... ]
    },
    {
      "type": "line",
      "title": "Trends over time",
      "xField": "<DATE_FIELD>",
      "yField": "<NUMERIC_FIELD>",
      "data": [ { "date": "<Date>", "value": <N> }, ... ]
    },
    {
      "type": "histogram",
      "title": "Distribution of <NUMERIC_FIELD>",
      "field": "<NUMERIC_FIELD>",
      "data": [ { "bin": "<Range>", "count": <N> }, ... ]
    }
  ]
}

Rules:
- Only include fields from the data.
- Omit any chart if required fields (e.g. dates) are missing.
- For bar and pie charts, limit data to the top 10 most frequent values.
- Do NOT include markdown, commentary, or explanation—return only pure JSON.
- Keep chart titles clear and field-based.

Here is the cleaned data in JSON:
${JSON.stringify(project.cleanedData.slice(0, 50), null, 2)}
`;

    // Ask OpenAI to suggest chart configurations
    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: "system", content: "You are a helpful business data analyst." },
        { role: "user", content: chartPrompt },
      ],
    });

    // Get raw output from OpenAI
    let openAIContent = response.choices[0]?.message?.content || "";
    openAIContent = openAIContent.trim();

    // Strip out markdown formatting or code blocks if present
    if (openAIContent.startsWith("```")) {
      openAIContent = openAIContent
        .replace(/^```[a-z]*\s*/i, "")
        .replace(/```$/, "");
    }

    // Clean out comments or trailing commas
    openAIContent = openAIContent
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/,?\s*\/\/.*$/gm, "")
      .replace(/\.\.\./g, "")
      .replace(/,\s*([\]}])/g, "$1");

    // Try parsing the OpenAI response into JSON
    let chartData = {};
    try {
      chartData = JSON.parse(openAIContent);
    } catch (err) {
      console.error("Failed to parse chart data JSON:", err);
      console.error("OpenAI raw output:", openAIContent);
      return res
        .status(500)
        .json({ error: "Failed to parse chart data JSON." });
    }

    // Limit chart data sets to reduce clutter in pie/bar charts
    if (Array.isArray(chartData.recommendedCharts)) {
      chartData.recommendedCharts = chartData.recommendedCharts.map((chart) => {
        if (
          ["bar", "pie"].includes(chart.type) &&
          Array.isArray(chart.data) &&
          chart.data.length > 8
        ) {
          return { ...chart, data: chart.data.slice(0, 8) };
        }
        return chart;
      });
    }

    // Save chart data to project and respond
    project.chartData = chartData;
    await project.save();
    res.json({ chartData });
  } catch (err) {
    console.error("[ChartDataUniversal] Chart data generation error:", err);
    res.status(500).json({ error: "Failed to generate chart data" });
  }
};
