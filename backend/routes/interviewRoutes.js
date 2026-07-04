const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createInterview,
   getMyInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

router.get("/", protect, getMyInterviews);

router.post("/", protect, createInterview);

router.get("/:id", protect, getInterviewById);

router.put("/:id", protect, updateInterview);

router.delete("/:id", protect, deleteInterview);

module.exports = router;