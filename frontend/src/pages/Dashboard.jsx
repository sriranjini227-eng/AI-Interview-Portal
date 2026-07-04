import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    averageScore: 0,
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats({
        total: res.data.totalInterviews,
        completed: res.data.completed,
        pending: res.data.pending,
        averageScore: res.data.averageScore,
      });

      setRecent(res.data.recentInterviews);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
const pieData = [
  {
    name: "Completed",
    value: stats.completed,
  },
  {
    name: "Pending",
    value: stats.pending,
  },
];

const barData = recent.map((item) => ({
  name: item.role,
  score: item.score || 0,
}));

const COLORS = ["#22c55e", "#facc15"];
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold text-blue-600">
              🤖 AI Interview Portal
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back! Ready to improve your interview skills?
            </p>

          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition"
          >
            Logout
          </button>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">

            <h3 className="text-gray-500">
              📋 Total Interviews
            </h3>

            <p className="text-4xl font-bold mt-3">
              {stats.total}
            </p>

          </div>

          <div className="bg-green-500 text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">

            <h3>
              ✅ Completed
            </h3>

            <p className="text-4xl font-bold mt-3">
              {stats.completed}
            </p>

          </div>

          <div className="bg-yellow-500 text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">

            <h3>
              ⏳ Pending
            </h3>

            <p className="text-4xl font-bold mt-3">
              {stats.pending}
            </p>

          </div>

          <div className="bg-purple-600 text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">

            <h3>
              ⭐ Average Score
            </h3>

            <p className="text-4xl font-bold mt-3">
              {stats.averageScore}/10
            </p>

          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

  {/* Pie Chart */}

  <div className="bg-white rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-6">
      📊 Interview Status
    </h2>

    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={100}
          label
        >

          {pieData.map((entry, index) => (

            <Cell
              key={index}
              fill={COLORS[index]}
            />

          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

  {/* Bar Chart */}

  <div className="bg-white rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-6">
      📈 Interview Scores
    </h2>

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={barData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis domain={[0, 10]} />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="score"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

        {/* Quick Actions */}

        <div className="flex gap-4 mt-10">

          <button
            onClick={() => navigate("/generate")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            ➕ Create Interview
          </button>

          <button
            onClick={() => navigate("/my-interviews")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
          >
            📋 My Interviews
          </button>

        </div>

        {/* Recent Interviews */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

          <h2 className="text-2xl font-bold mb-6">
            📋 Recent Interviews
          </h2>

          {recent.length === 0 ? (

            <p className="text-gray-500">
              No interviews found.
            </p>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="text-left p-3">Title</th>

                  <th className="text-left p-3">Role</th>

                  <th className="text-left p-3">Status</th>

                  <th className="text-left p-3">Score</th>

                </tr>

              </thead>

              <tbody>

                {recent.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {item.title}
                    </td>

                    <td className="p-3">
                      {item.role}
                    </td>

                    <td className="p-3">

                      {item.status === "Completed" ? (

                        <span className="text-green-600 font-semibold">
                          ✅ Completed
                        </span>

                      ) : (

                        <span className="text-yellow-600 font-semibold">
                          ⏳ Pending
                        </span>

                      )}

                    </td>

                    <td className="p-3">

                      {item.score != null ? (
                        <span className="font-bold">
                          {item.score}/10
                        </span>
                      ) : (
                        "-"
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;