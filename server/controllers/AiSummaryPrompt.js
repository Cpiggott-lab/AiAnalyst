const Project = require("../models/Project");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateSummary = async ({ projectId, userId }) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    if (project.userId.toString() !== userId) {
      throw new Error("Unauthorized access");
    }

    const prompt = `
You are a business data analyst. Analyze the following lead data and return an executive summary that includes:

1. A high-level description of the data (e.g., number of records, common fields).
2. Key patterns or trends that could be visualized in charts. Focus on:
   - Lead source distribution
   - Deal stage distribution
   - Most common companies or lead owners (top 5)
   - Email or phone availability stats
3. Any obvious data quality issues (e.g. missing fields, duplicates).

Present your findings in clear bullet points, emphasizing data-driven insights that can be used to guide sales strategy or dashboard design.

Here is the lead data in JSON:

${JSON.stringify(project.cleanedData.slice(0, 50), null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: "system", content: "You are a helpful business analyst." },
        { role: "user", content: prompt },
      ],
    });

    const summary =
      response.choices[0]?.message?.content || "No summary generated.";
    project.summary = summary;
    await project.save();

    return summary;
  } catch (err) {
    console.error("Summary generation error:", err);
    throw err; // Rethrow the error to handle it in the calling function
  }
};

exports.askSummaryQuestion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userQuestion = req.body.question;
    if (!userQuestion) {
      return res.status(400).json({ error: "Question is required" });
    }

    const prompt = `
You are a business data analyst. The user has already received the following summary of a dataset:

SUMMARY:
${project.summary}

The user now asks: "${userQuestion}"

Please answer the user's question clearly, referencing only the provided summary and maintaining a professional tone.
    `;

    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: "system", content: "You are a helpful business analyst." },
        { role: "user", content: prompt },
      ],
    });

    const answer =
      response.choices[0]?.message?.content || "No answer generated.";
    res.json({ answer });
  } catch (err) {
    console.error("Follow-up question error:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
};
