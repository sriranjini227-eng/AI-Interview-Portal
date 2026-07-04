import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState([]);
const [evaluation, setEvaluation] = useState(null);
const TOTAL_TIME = 20 * 60; // 20 minutes
const [isListening, setIsListening] = useState(false);

const recognitionRef = useRef(null);

const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    fetchInterview();
  }, []);
  useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);

        toast.error("⏰ Time is up! Submitting interview...");

        handleSubmit();

        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition is not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    setIsListening(false);
  };

recognition.onresult = (event) => {
  console.log("Speech detected!", event);

  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }

  console.log("Transcript:", transcript);

  setAnswers((prev) => {
    const updated = [...prev];
    updated[currentQuestion] = transcript;
    return updated;
  });
};

  recognitionRef.current = recognition;
}, [currentQuestion]);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterview(res.data);

    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
if (!interview) {
  return <Loader />;
}
const handleAnswerChange = (e) => {
  const updatedAnswers = [...answers];
  updatedAnswers[currentQuestion] = e.target.value;
  setAnswers(updatedAnswers);
};
const startListening = () => {
  if (!recognitionRef.current) {
    toast.error("Speech Recognition is not supported in your browser.");
    return;
  }

  recognitionRef.current.start();
};
const stopListening = () => {
  recognitionRef.current?.stop();
};
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    // 1. Get AI evaluation
    const res = await API.post(
      "/ai/evaluate",
      {
        questions: interview.questions,
        answers,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEvaluation(res.data);
    console.log("Answers being sent:", answers);
   await API.put(
  `/interviews/${id}`,
  {
    status: "Completed",
    score: res.data.score,
    feedback: res.data.feedback,
      answers: answers, 
    strengths: res.data.strengths,
    improvements: res.data.improvements,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    // 2. Save evaluation to database

   navigate(`/result/${id}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Evaluation Failed");
  }
};
const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");

const seconds = String(timeLeft % 60).padStart(2, "0");
  return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-4xl font-bold text-blue-600">
  🤖 {interview.title}
</h1>
<div className="flex justify-end mt-4">

  <div
    className={`px-6 py-3 rounded-xl text-white font-bold text-xl ${
      timeLeft <= 300
        ? "bg-red-600 animate-pulse"
        : "bg-blue-600"
    }`}
  >
    ⏱ {minutes}:{seconds}
  </div>

</div>

      <p className="text-gray-600 mt-2">
  💼 <strong>Role:</strong> {interview.role}
</p>

     <p className="text-gray-600">
  🎯 <strong>Difficulty:</strong> {interview.difficulty}
</p>

      <div className="mt-8">

  <div className="flex justify-between mb-2">

    <span className="font-semibold">
      Question {currentQuestion + 1} of {interview.questions.length}
    </span>

    <span>
      {Math.round(
        ((currentQuestion + 1) / interview.questions.length) * 100
      )}%
    </span>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-3">

    <div
      className="bg-blue-600 h-3 rounded-full"
      style={{
        width: `${
          ((currentQuestion + 1) / interview.questions.length) * 100
        }%`,
      }}
    ></div>

  </div>

</div>

<div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5 mt-8">

  <h2 className="text-xl font-semibold">
    {interview.questions[currentQuestion]}
  </h2>

</div>

<textarea
  rows="8"
  placeholder="Write your answer here..."
  value={answers[currentQuestion] || ""}
  onChange={handleAnswerChange}
  className="w-full mt-6 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
/>
<div className="flex gap-4 mt-4">

  {!isListening ? (

    <button
      onClick={startListening}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
    >
      🎤 Start Speaking
    </button>
    

  ) : (

    <button
      onClick={stopListening}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl animate-pulse flex items-center gap-2 transition"
    >
      🔴 Stop Recording
    </button>

  )}

</div>
{isListening && (
  <p className="mt-3 text-red-600 font-semibold animate-pulse">
    🎤 Listening...
  </p>
)}
<br />
<br />

<button
  disabled={currentQuestion === 0}
  onClick={() => setCurrentQuestion(currentQuestion - 1)}
>
  Previous
</button>

&nbsp;&nbsp;

{currentQuestion === interview.questions.length - 1 ? (
  <button onClick={handleSubmit}>
    Submit Interview
  </button>
) : (
  <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
    Next
  </button>
)}

    </div>
    </div>
  );
}

export default Interview;