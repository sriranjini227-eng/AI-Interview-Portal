import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-interview-portal-2zlf.onrender.com/api",
});

export default API;