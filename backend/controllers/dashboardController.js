const Interview = require("../models/Interviews");

const getDashboard = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    const totalInterviews = interviews.length;

    const completed = interviews.filter(
      (item) => item.status === "Completed"
    ).length;

    const pending = interviews.filter(
      (item) => item.status === "Pending"
    ).length;

    const completedScores = interviews.filter(
      (item) =>
        item.status === "Completed" &&
        item.score !== undefined &&
        item.score !== null
    );

    const averageScore =
      completedScores.length > 0
        ? (
            completedScores.reduce(
              (sum, item) => sum + item.score,
              0
            ) / completedScores.length
          ).toFixed(1)
        : 0;

    const recentInterviews = interviews.slice(0, 5);

    res.json({
      totalInterviews,
      completed,
      pending,
      averageScore,
      recentInterviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};