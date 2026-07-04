import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import GenerateInterview from "./pages/GenerateInterview";
import MyInterviews from "./pages/MyInterviews";
import Result from "./pages/Result";
import { Toaster } from "react-hot-toast";
import InterviewDetails from "./pages/InterviewDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<GenerateInterview />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/my-interviews" element={<MyInterviews />} />
        <Route path="/result/:id" element={<Result />} />
        <Route
  path="/details/:id"
  element={<InterviewDetails />}
/>
      </Routes>
      <Toaster
  position="top-right"
  reverseOrder={false}
/>
    </BrowserRouter>

  );
}

export default App;