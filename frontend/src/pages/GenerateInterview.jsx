import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../services/api";

function GenerateInterview() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  

  const generateQuestions = async () => {
    if (!role.trim()) {
      toast.error("Please enter a job role.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/ai/generate",
        {
          role,
          difficulty,
        }
      );

      await API.post(
  "/interviews",
  {
    title: `${role} Interview`,
    role,
    difficulty,
    questions: res.data.questions.split("\n"),
  },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuestions(res.data.questions);

     navigate("/my-interviews");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-blue-600">
            🤖 Create AI Interview
          </h1>

          <p className="text-gray-500 mt-2">
            Generate personalized interview questions powered by AI.
          </p>

        </div>

        {/* Form Card */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Role */}

          <div className="mb-6">

            <label className="block text-lg font-semibold mb-2">
              💼 Job Role
            </label>

            <input
              type="text"
              placeholder="e.g. React Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Difficulty */}

          <div className="mb-8">

            <label className="block text-lg font-semibold mb-2">
              📊 Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

          </div>

          {/* Button */}

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-lg font-semibold py-4 rounded-xl transition"
          >
            {loading ? "⏳ Generating Interview..." : "🚀 Generate Interview"}
          </button>

        </div>

        {/* Generated Questions */}

        {questions && (

          <div className="bg-white rounded-2xl shadow-xl p-8 mt-10">

            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              📋 Generated Questions
            </h2>

            {questions
              .split("\n")
              .filter((q) => q.trim() !== "")
              .map((question, index) => (

                <div
                  key={index}
                  className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5 mb-4"
                >
                  <p className="font-medium">
                    {question}
                  </p>
                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default GenerateInterview;