const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    questions: [
      {
        type: String,
      },
    ],

    

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    score: {
  type: Number,
  default: 0,
},

feedback: {
  type: String,
  default: "",
},
answers: {
  type: [String],
  default: [],
},
strengths: {
  type: [String],
  default: [],
},

improvements: {
  type: [String],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);