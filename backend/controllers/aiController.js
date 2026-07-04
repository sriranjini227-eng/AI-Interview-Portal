const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

// ===============================
// Generate Interview Questions
// ===============================
const generateQuestions = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    const prompt = `
Generate 5 interview questions.

Role: ${role}
Difficulty: ${difficulty}

Return only the questions as a numbered list.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      questions: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

// ===============================
// Evaluate Interview Answers
// ===============================
const evaluateInterview = async (req, res) => {
  try {
    console.log("=== Evaluate endpoint hit ===");

    const { questions, answers } = req.body;

    console.log("Questions:", questions);
    console.log("Answers:", answers);

   const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's interview answers.

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Return ONLY valid JSON in exactly this format:

{
  "score": 8,
  "feedback": "Detailed paragraph explaining the overall performance.",
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ]
}

Rules:
- Score must be between 0 and 10.
- Feedback must be at least 80 words.
- strengths MUST contain exactly 3 meaningful points.
- improvements MUST contain exactly 3 meaningful points.
- Never return empty arrays.
- Never return null.
- Do not leave any field blank.
- Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

const text = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Response:", text);

const result = JSON.parse(text);
if (!result.strengths || result.strengths.length === 0) {
  result.strengths = [
    "Good understanding of core concepts.",
    "Answered most questions correctly.",
    "Shows strong technical potential."
  ];
}

if (!result.improvements || result.improvements.length === 0) {
  result.improvements = [
    "Provide more practical examples.",
    "Give more detailed explanations.",
    "Improve confidence while answering."
  ];
}

res.status(200).json(result);

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

module.exports = {
  generateQuestions,
  evaluateInterview,
};