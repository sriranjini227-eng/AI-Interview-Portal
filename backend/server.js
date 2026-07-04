const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

console.log("Gemini Key:", process.env.GEMINI_API_KEY);
connectDB();

const app = express();
app.use(cors({
  origin: "https://ai-interview-portal-rho.vercel.app",
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.send("AI Interview Portal Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});