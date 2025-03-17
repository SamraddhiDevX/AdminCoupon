import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import  { adminLogin, setAuthToken } from "../api"; 

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const { token } = await adminLogin(credentials.username, credentials.password);
      localStorage.setItem("token", token);
      setAuthToken(token); 
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <label htmlFor="username" className="block text-gray-700 font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your username"
        />

        <label htmlFor="password" className="block text-gray-700 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your password"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg transition-all flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
