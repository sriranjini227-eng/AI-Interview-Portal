const express = require("express");
const router = express.Router();

const { generateQuestions,
    evaluateInterview,
 } = require("../controllers/aiController");

router.post("/generate", generateQuestions);

router.post("/evaluate", evaluateInterview);

module.exports = router;