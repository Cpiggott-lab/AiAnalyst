const Project = require("../models/Project");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generates an executive summary using OpenAI
exports.generateSummary = async ({ projectId, userId, prompt }) => {
  try {
    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    // Only allow the owner of the project to generate a summary
    if (project.userId.toString() !== userId) {
      throw new Error("Unauthorized access");
    }

    // Take first 50 rows from cleaned data to keep the prompt lightweight
    const datasetPreview = project.cleanedData.slice(0, 50);
    const datasetString = JSON.stringify(datasetPreview, null, 2);
    const userPrompt = prompt?.trim();

    // Build prompt with formatting, layout, and constraints for clean HTML output
    const finalPrompt = `
You are an AI business data analyst helping a startup founder interpret a CSV dataset.

Below is a preview of the dataset (first 50 rows):

${datasetString}

The user has optionally provided a custom analysis request:
"${userPrompt || "No specific request. Provide a standard executive summary."}"

---

Please respond **strictly in semantic HTML** with **inline CSS styling** for clean rendering inside a React component using \`dangerouslySetInnerHTML\`. Do **not return Markdown**, plain text, or inferred UI components.

---

### ✅ REQUIRED STRUCTURE:

Wrap all content in a single \`<section>\`. Use **five blocks**, each inside a div with class \`summary-block\`. Keep spacing tight and layout clean.

Here’s the exact format you must use:

<style>
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  h2 {
    font-size: 1.1rem;
    margin-top: 0.75rem;
    margin-bottom: 0.2rem;
    color: #1f2937;
  }
  p {
    font-size: 0.95rem;
    margin: 0 0 0.25rem 0;
    line-height: 1.4;
    color: #111827;
  }
  ul {
    padding-left: 1.2rem;
    margin: 0;
    list-style-type: disc;
  }
  li {
    margin-bottom: 0.15rem;
    font-size: 0.9rem;
    line-height: 1.3;
    color: #374151;
  }
  .summary-block {
    background-color: #f9fafb;
    padding: 1rem;
    margin-bottom: 0.75rem;
    border-left: 4px solid #000000;
    border-radius: 0.375rem;
  }
</style>

<section>
  <h1>Executive Summary</h1>

  <div class="summary-block">
    <h2>Overall Summary</h2>
    <p>Provide a rich, 2–3 sentence overview of the dataset as a whole. Focus on major patterns, purpose, and usefulness of the data.</p>
  </div>

  <div class="summary-block">
    <h2>Overview</h2>
    <p>Include total record count, key fields/columns, and types of information available.</p>
  </div>

  <div class="summary-block">
    <h2>Key Insights</h2>
    <ul>
      <li>Identify high-level patterns (e.g., most frequent brands, average pricing bands).</li>
      <li>Call out distributions or comparisons suitable for charts (e.g., segment mix, deal stages).</li>
      <li>Mention contact info completeness (email/phone) if present.</li>
    </ul>
  </div>

  <div class="summary-block">
    <h2>Data Quality Issues</h2>
    <ul>
      <li>Flag any issues like nulls, inconsistent casing, duplicates, or formatting differences.</li>
      <li>If assumptions were needed, state them clearly (e.g., inferred fields, grouped values).</li>
    </ul>
  </div>

  <div class="summary-block">
    <h2>Recommendations</h2>
    <ul>
      <li>Suggest meaningful charts or KPIs to display (e.g., bar chart for brand count, pie for segment).</li>
      <li>Propose ways to enhance the dataset (e.g., enrich with battery size, normalize plug types).</li>
    </ul>
  </div>
</section>

---

### 🔒 HARD CONSTRAINTS:

- **Do not infer user goals** beyond the data or prompt.
- **Do not return JSON, JSX, or Markdown**.
- **Do not hallucinate chart names or metrics** not clearly suggested by the dataset preview.
- **Avoid repeating section labels or summaries.**

This will be rendered directly into a live UI. Ensure the output is clean, minimal, and consistent with semantic HTML standards.
`;

    // Send request to OpenAI with the structured prompt
    const response = await openai.chat.completions.create({
      model: "o4-mini", // or "gpt-4"
      messages: [
        { role: "system", content: "You are a helpful business analyst." },
        { role: "user", content: finalPrompt },
      ],
    });

    // Get the summary output (fallback if empty)
    const summary =
      response.choices[0]?.message?.content || "No summary generated.";

    // Save summary and user prompt to the project
    project.summary = summary;
    if (userPrompt) project.prompt = userPrompt;

    await project.save();

    return summary;
  } catch (err) {
    console.error("Summary generation error:", err);
    throw err;
  }
};

// Allows user to ask follow-up questions about the summary
exports.askSummaryQuestion = async (req, res) => {
  try {
    // Find the project
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Only allow owner of the project to ask questions
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userQuestion = req.body.question;
    if (!userQuestion) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Build a follow-up prompt using the existing summary
    const prompt = `
You are a business data analyst. The user has already received the following summary of a dataset:

SUMMARY:
${project.summary}

The user now asks: "${userQuestion}"

Please answer the user's question clearly and professionally, referencing only the provided summary. Avoid using external information or assumptions not contained in the summary.
    `;

    // Send follow-up prompt to OpenAI
    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: "system", content: "You are a helpful business analyst." },
        { role: "user", content: prompt },
      ],
    });

    // Send back the answer or fallback
    const answer =
      response.choices[0]?.message?.content || "No answer generated.";
    res.json({ answer });
  } catch (err) {
    console.error("Follow-up question error:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
};
