import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
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
const checkPage = (doc, y) => {
  if (y > 270) {
    doc.addPage();
    return 20;
  }
  return y;
};
  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("AI Interview Report", 20, 20);

  doc.setFontSize(14);

  doc.text(`Interview: ${interview.title}`, 20, 40);
  doc.text(`Role: ${interview.role}`, 20, 50);
  doc.text(`Difficulty: ${interview.difficulty}`, 20, 60);
  doc.text(`Score: ${interview.score}/10`, 20, 70);

  doc.text("Feedback:", 20, 90);

  const feedback = doc.splitTextToSize(
    interview.feedback || "",
    170
  );

  doc.text(feedback, 20, 100);

  let y = 120 + feedback.length * 6;

  doc.text("Strengths:", 20, y);

  y += 10;

  interview.strengths?.forEach((item) => {
  const lines = doc.splitTextToSize(`• ${item}`, 165);
    y = checkPage(doc, y);

  doc.text(lines, 25, y);

  y += lines.length * 7;
});

  y += 5;

  doc.text("Areas for Improvement:", 20, y);

  y += 10;

  interview.improvements?.forEach((item) => {
  const lines = doc.splitTextToSize(`• ${item}`, 165);

  doc.text(lines, 25, y);

  y += lines.length * 7;
});

  doc.save("AI_Interview_Report.pdf");
};
console.log("Interview Data:", interview);
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          🤖 AI Interview Report
        </h1>

        <p className="text-gray-500 mb-8">
          {interview.title}
        </p>

        <div className="bg-green-100 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-semibold">
            🏆 Overall Score
          </h2>

          <p className="text-5xl font-bold text-green-700 mt-3">
            {interview.score}/10
          </p>

        </div>

       <div className="bg-gray-50 rounded-xl p-6 mb-8">

  <h2 className="text-2xl font-bold mb-4">
    💬 Overall Feedback
  </h2>

  <p className="text-gray-700">
    {interview.feedback}
  </p>

</div>
<div className="grid md:grid-cols-2 gap-6">

  {/* Strengths */}

  <div className="bg-green-50 border border-green-200 rounded-xl p-6">

    <h2 className="text-xl font-bold text-green-700 mb-4">
      💪 Strengths
    </h2>

    <ul className="list-disc ml-5 space-y-2">
      {interview.strengths?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>

  {/* Improvements */}

  <div className="bg-red-50 border border-red-200 rounded-xl p-6">

    <h2 className="text-xl font-bold text-red-700 mb-4">
      📈 Areas for Improvement
    </h2>

    <ul className="list-disc ml-5 space-y-2">
      {interview.improvements?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>

</div>
<button
  onClick={downloadPDF}
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg mr-8 mt-5"
>
  📄 Download PDF
</button>

        <button
          onClick={() => navigate("/my-interviews")}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          ← Back to My Interviews
        </button>

      </div>

    </div>
  );
}

export default Result;