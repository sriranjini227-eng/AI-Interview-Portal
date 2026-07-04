import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center px-6">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">🤖</div>

          <h1 className="text-4xl font-bold text-white">
            AI Interview Portal
          </h1>

          <p className="text-blue-100 mt-2">
            Practice • Improve • Get Hired
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="📧 Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white outline-none border border-white/20 focus:border-white"
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white outline-none border border-white/20 focus:border-white"
          />

          <button
            className="w-full bg-white text-blue-700 font-bold py-4 rounded-xl hover:scale-105 transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-center text-white mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="font-bold ml-2 underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;