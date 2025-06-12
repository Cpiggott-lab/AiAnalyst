const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rawData: { type: Array, required: true },
  cleanedData: { type: Array, required: true },
  summary: { type: String },
  chartData: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  notes: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
      createdBy: String,
    },
  ],
});
projectSchema.index({ createdAt: -1 }); // Index for sorting by creation date

module.exports = mongoose.model("Project", projectSchema);
