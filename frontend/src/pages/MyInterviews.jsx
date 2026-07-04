import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [difficultyFilter, setDifficultyFilter] = useState("All"); 
  const [sortBy, setSortBy] = useState("Newest");
const navigate = useNavigate();
  useEffect(() => {
    fetchInterviews();
  }, []);

 const fetchInterviews = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.get("/interviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setInterviews(res.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to load interviews");
  } finally {
    setLoading(false);
  }
};
  const deleteInterview = async (id) => {
  const result = await Swal.fire({
    title: "Delete Interview?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#3b82f6",
    confirmButtonText: "Yes, Delete",
  });

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("token");

    await API.delete(`/interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Interview Deleted Successfully");

    fetchInterviews();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};
const filteredInterviews = [...interviews] .filter((item) => { 
  const matchesSearch = 
  item.title.toLowerCase().includes(search.toLowerCase()) ||
   item.role.toLowerCase().includes(search.toLowerCase()); 
   const matchesStatus = statusFilter === "All" || item.status === statusFilter; 
   const matchesDifficulty = difficultyFilter === "All" || item.difficulty === difficultyFilter; 
   return matchesSearch && matchesStatus && matchesDifficulty; }) .sort((a, b) => { if (sortBy === "Newest") { return new Date(b.createdAt) - new Date(a.createdAt); 
   } if (sortBy === "Oldest") { return new Date(a.createdAt) - new Date(b.createdAt); } if (sortBy === "Highest Score") { return (b.score || 0) - (a.score || 0); 
   } if (sortBy === "Lowest Score") { return (a.score || 0) - (b.score || 0); } return 0; });
   if (loading) {
  return <Loader />;
}
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="mb-8">
  <h1 className="text-4xl font-bold text-blue-600 mb-6">
    📋 My Interviews
  </h1>
  <div className="grid md:grid-cols-4 gap-4 mb-8">

  <input
    type="text"
    placeholder="🔍 Search interview or role..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
  >
    <option>All</option>
    <option>Completed</option>
    <option>Pending</option>
  </select>

  <select
    value={difficultyFilter}
    onChange={(e) => setDifficultyFilter(e.target.value)}
    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
  >
    <option>All</option>
    <option>Easy</option>
    <option>Medium</option>
    <option>Hard</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
  >
    <option>Newest</option>
    <option>Oldest</option>
    <option>Highest Score</option>
    <option>Lowest Score</option>
  </select>

</div>

  <p className="text-gray-500 mt-2">
    View and manage all your AI interviews.
  </p>
</div>

      {filteredInterviews.length === 0 ? (
  <div className="text-center mt-20">

    <div className="text-7xl">
      📂
    </div>

    <h2 className="text-3xl font-bold mt-5">
      No Interviews Found
    </h2>

    <p className="text-gray-500 mt-3">
      Create your first AI Interview!
    </p>

  </div>
) : (
       filteredInterviews.map((item) => (
       <div
  key={item._id}
  className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition"
>
  <div className="flex justify-between items-center">

    <h2 className="text-2xl font-bold">
      {item.title}
    </h2>

    <span
      className={`px-4 py-1 rounded-full text-white font-semibold ${
        item.status === "Completed"
          ? "bg-green-500"
          : "bg-yellow-500"
      }`}
    >
      {item.status}
    </span>

  </div>

  <div className="mt-4 space-y-2 text-gray-600">

    <p>
      💼 <strong>Role:</strong> {item.role}
    </p>

    <p>
      🎯 <strong>Difficulty:</strong> {item.difficulty}
    </p>

    <p>
      ⭐ <strong>Score:</strong> {item.score}
    </p>

  </div>

  <div className="flex flex-wrap gap-3 mt-6">

    {item.status === "Pending" ? (
      <button
        onClick={() => navigate(`/interview/${item._id}`)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
      >
        ▶ Start
      </button>
    ) : (
      <button
        disabled
        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
      >
        ✔ Completed
      </button>
    )}

    {item.status === "Completed" && (
      <button
        onClick={() => navigate(`/result/${item._id}`)}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
      >
        📄 View Result
      </button>
    )}

    <button
      onClick={() => deleteInterview(item._id)}
      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
    >
      🗑 Delete
    </button>
    <button
  onClick={() => navigate(`/details/${item._id}`)}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
>
  👁 View Details
</button>

  </div>
</div>
        ))
      )}
    </div>
  );
}

export default MyInterviews;
