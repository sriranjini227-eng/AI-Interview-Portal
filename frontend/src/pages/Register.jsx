import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration Successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center px-6">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>

          <h1 className="text-4xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-blue-100 mt-2">
            Join AI Interview Portal today
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            placeholder="👤 Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white border border-white/20 outline-none"
          />

          <input
            type="email"
            placeholder="📧 Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white border border-white/20 outline-none"
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white border border-white/20 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-bold py-4 rounded-xl hover:scale-105 transition duration-300"
          >
            Register
          </button>

        </form>

        <p className="text-center text-white mt-6">
          Already have an account?

          <Link
            to="/"
            className="font-bold ml-2 underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;