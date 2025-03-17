import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ClaimPage from "./components/ClaimPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import GuestCoupons from "./Pages/GuestCoupons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CouponProvider } from "./Context/CouponContext";
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Welcome to Coupon Management</h1>
      <div className="space-x-4">
        <button 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/admin")}
        >
          Admin Login
        </button>
        <button 
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          onClick={() => navigate("/claim")}
        >
          Guest Login
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <CouponProvider>
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/coupons" element={<GuestCoupons />} />
        <Route path="/claim" element={<ClaimPage />} />
      </Routes>
    </Router>
    </CouponProvider>
  );
}

export default App;
