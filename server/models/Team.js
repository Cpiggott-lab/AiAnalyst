//Not being used yet
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamLeader: { type: String, required: true },
  teamLeaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});

module.exports = mongoose.model("Team", teamSchema);
