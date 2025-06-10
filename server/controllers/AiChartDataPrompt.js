const Project = require("../models/Project");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateChartDataUniversal = async (req, res) => {
  try {
    // Get the project and check if this is the right user
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized access" });

    // If charts already exist, just return them
    if (project.chartData && Object.keys(project.chartData).length > 0) {
      return res.json({ chartData: project.chartData });
    }

    // Build the OpenAI prompt
    const chartPrompt = `
You are a data analyst. The user will upload any cleaned CSV or JSON table (with arbitrary columns, e.g. sales, leads, survey results, etc). 

Analyze the dataset below, then for each chart type, output the best-suited fields as arrays or objects, with these requirements:
- Only use fields present in the data
- If a chart is not relevant (e.g. no time field for a line chart), skip it
- Return only raw JSON. No markdown, no explanation, no preamble. Use this structure:

{
  "recommendedCharts": [
    {
      "type": "bar",
      "title": "Top categories by count",
      "field": "<FIELD_NAME>",
      "data": [ {"label": "<Value>", "count": <N> }, ... ]
    },
    {
      "type": "pie",
      "title": "Share of <FIELD_NAME>",
      "field": "<FIELD_NAME>",
      "data": [ {"label": "<Value>", "count": <N> }, ... ]
    },
    {
      "type": "line",
      "title": "Trends over time",
      "xField": "<DATE_FIELD>",
      "yField": "<NUMERIC_FIELD>",
      "data": [ {"date": "<Date>", "value": <N> }, ... ]
    },
    {
      "type": "histogram",
      "title": "Distribution of <NUMERIC_FIELD>",
      "field": "<NUMERIC_FIELD>",
      "data": [ {"bin": "<Range>", "count": <N> }, ... ]
    }
  ]
}

If a field is missing for a chart type, omit that chart. 
Base your choices on the most relevant or populous columns for the dataset.

Here is the cleaned data in JSON:
${JSON.stringify(project.cleanedData.slice(0, 50), null, 2)}
`;

    // Send the prompt to OpenAI
    const response = await openai.chat.completions.create({
      // model: "gpt-4-1106-preview",
      model: "o4-mini",
      messages: [
        { role: "system", content: "You are a helpful business data analyst." },
        { role: "user", content: chartPrompt },
      ],
      // temperature: 0.2,
    });

    // Get the response text
    let openAIContent = response.choices[0]?.message?.content || "";
    openAIContent = openAIContent.trim();

    // Remove code block markers if present
    if (openAIContent.startsWith("```")) {
      openAIContent = openAIContent
        .replace(/^```[a-z]*\s*/i, "")
        .replace(/```$/, "");
    }

    // Remove comments so JSON.parse won't break
    openAIContent = openAIContent.replace(/^\s*\/\/.*$/gm, "");
    openAIContent = openAIContent.replace(/,?\s*\/\/.*$/gm, "");

    //  Strip ellipses and trailing commas
    openAIContent = openAIContent.replace(/\.\.\./g, "");
    openAIContent = openAIContent.replace(/,\s*([\]}])/g, "$1");

    // Now parse JSON
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

    // Save chart data and send it back
    project.chartData = chartData;
    await project.save();
    res.json({ chartData });
  } catch (err) {
    console.error("[ChartDataUniversal] Chart data generation error:", err);
    res.status(500).json({ error: "Failed to generate chart data" });
  }
};
