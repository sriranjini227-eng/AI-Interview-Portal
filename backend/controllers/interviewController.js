const Interview = require("../models/Interviews");

// Create Interview
const createInterview = async (req, res) => {
  try {
    const { title, role, difficulty, questions } = req.body;

    const interview = await Interview.create({
      user: req.user,
      title,
      role,
      difficulty,
      questions,
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get all interviews of logged-in user
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Interview By ID
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
  _id: req.params.id,
  user: req.user,
});

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update Interview
// Update Interview
const updateInterview = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }
console.log(req.body);
    interview.status = req.body.status || interview.status;
    interview.score = req.body.score ?? interview.score;
    interview.feedback = req.body.feedback || interview.feedback;
    interview.answers = req.body.answers || interview.answers;
    interview.strengths = req.body.strengths || interview.strengths;
    interview.improvements =
      req.body.improvements || interview.improvements;

    await interview.save();

    res.status(200).json(interview);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Delete Interview
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
    deleteInterview,
};