import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function InterviewDetails() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterview(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-blue-600">
          📄 {interview.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-gray-500">Role</p>
            <h2 className="text-xl font-bold">{interview.role}</h2>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-gray-500">Difficulty</p>
            <h2 className="text-xl font-bold">{interview.difficulty}</h2>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-gray-500">Score</p>
            <h2 className="text-xl font-bold">
              ⭐ {interview.score}/10
            </h2>
          </div>
          </div>
        <div className="mt-10">

  <h2 className="text-3xl font-bold mb-6">
    ❓ Interview Questions
  </h2>

  <div className="space-y-4">

    {interview.questions.map((question, index) => (

      <div
        key={index}
        className="bg-gray-50 border rounded-xl p-5"
      >

        <h3 className="font-bold text-blue-600">
          Question {index + 1}
        </h3>

        <p className="mt-2">
          {question}
        </p>

      </div>

    ))}

  </div>

</div>
<div className="mt-10">

  <h2 className="text-3xl font-bold mb-6">
    💬 Your Answers
  </h2>

  <div className="space-y-4">

    {(interview.answers || []).map((answer, index) => (

      <div
        key={index}
        className="bg-green-50 border border-green-200 rounded-xl p-5"
      >

        <h3 className="font-bold text-green-700">
          Answer {index + 1}
        </h3>

        <p className="mt-2 whitespace-pre-wrap">
          {answer || "No answer provided."}
        </p>

      </div>

    ))}

  </div>

</div>
<div className="mt-10 bg-blue-50 rounded-2xl p-6">

  <h2 className="text-3xl font-bold text-blue-700 mb-4">
    📝 AI Feedback
  </h2>

  <p className="text-gray-700 leading-8">
    {interview.feedback}
  </p>

</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
  {/* Strengths */}

  <div className="bg-green-50 border border-green-200 rounded-xl p-6 h-full">

    <h2 className="text-2xl font-bold text-green-700 mb-4">
      💪 Strengths
    </h2>

    <ul className="space-y-3">

      <div className="space-y-4 mt-6">
  {interview.strengths.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      ✅ {item}
    </div>
  ))}
</div>

    </ul>

  </div>

  {/* Improvements */}

  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full">

    <h2 className="text-2xl font-bold text-red-700 mb-4">
      📈 Areas for Improvement
    </h2>

    <ul className="space-y-3">

      <div className="space-y-4 mt-6">
  {interview.improvements.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      🔸 {item}
    </div>
  ))}
</div>

    </ul>

  </div>

</div>


        </div>

      </div>
  );
}

export default InterviewDetails;