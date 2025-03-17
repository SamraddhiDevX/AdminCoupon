import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCoupons } from "../Context/CouponContext"; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    coupons,
    loading,
    claimHistory,
    toggleCouponStatus,
    fetchClaimHistory,
    deleteCoupon,
    updateCoupon,
    addCoupon,  
  } = useCoupons(); 

  const token = localStorage.getItem("token");

  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false); 
  const [couponName, setCouponName] = useState("");
  const [couponCode, setCouponCode] = useState(""); 
  const [selectedCoupon, setSelectedCoupon] = useState(null); 

  useEffect(() => {
    
    if (!token) {
      navigate("/admin");
      return;
    }

    fetchClaimHistory(); 
  }, [token, navigate]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!");
    navigate("/"); 
  };

  const handleDeleteCoupon = (couponId) => {
    deleteCoupon(couponId); 
  };

  const handleUpdateCoupon = (coupon) => {
     setSelectedCoupon(coupon);
    setCouponName(coupon.name); 
    setCouponCode(coupon.code); 
  };
  const handleSubmitUpdate = () => {
   if (couponName && couponCode) {
      const updatedCoupon = {
        _id: selectedCoupon._id, 
        name: couponName,
        code: couponCode,
      };
      updateCoupon(updatedCoupon); 
      fetchClaimHistory(); 
      setSelectedCoupon(null); 
      setCouponName(""); 
      setCouponCode(""); 
     
    } else {
      toast.warning("Coupon name and code are required.");
    }
  };
  const handleAddCoupon = () => {
      if (couponName && couponCode) {
      addCoupon({ name: couponName, code: couponCode });
      setCouponName(""); 
      setCouponCode(""); 
      setIsAddCouponOpen(false); 
    } else {
      toast.warning("Coupon name and code are required.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

    
      <button
        onClick={() => setIsAddCouponOpen(!isAddCouponOpen)}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {isAddCouponOpen ? "Cancel" : "Add Coupon"}
      </button>

     
      {isAddCouponOpen && (
        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Add New Coupon</h3>
          <div>
            <input
              type="text"
              placeholder="Coupon Name"
              value={couponName}
              onChange={(e) => setCouponName(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button
              onClick={handleAddCoupon}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Coupon
            </button>
          </div>
        </div>
      )}

    
      {selectedCoupon && (
        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Update Coupon</h3>
          <div>
            <input
              type="text"
              placeholder="Coupon Name"
              value={couponName}
              onChange={(e) => setCouponName(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button
              onClick={handleSubmitUpdate}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Coupon
            </button>
            <button
              onClick={() => setSelectedCoupon(null)}
              className="w-full px-4 py-2 mt-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

     
      <h3 className="text-lg font-semibold mb-3">All Coupons</h3>
      {loading ? (
        <p className="text-center">Loading coupons...</p>
      ) : (
        <ul className="space-y-3">
          {coupons.map((coupon) => (
            <li
              key={coupon._id}
              className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {coupon.name} - {coupon.code}
                </p>
                <p
                  className={`text-sm font-bold ${
                    coupon.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Disabled"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                  className={`px-3 py-1 ${
                    coupon.isActive ? "bg-red-500" : "bg-green-500"
                  } text-white rounded hover:opacity-75`}
                >
                  {coupon.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleUpdateCoupon(coupon)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-75"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

   
      <h3 className="text-lg font-semibold mt-6 mb-3">Claimed Coupons</h3>
      {claimHistory.length === 0 ? (
        <p className="text-gray-500">No claimed coupons yet.</p>
      ) : (
        <ul className="space-y-3">
          {claimHistory.map((coupon) => (
            <li key={coupon._id} className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="font-semibold">{coupon.name} - {coupon.code}</p>
              <ul className="mt-2 space-y-1">
                {coupon.claims.map((claim, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    <p>
                      🏷 <strong>IP Address:</strong> {claim.ipAddress}
                    </p>
                    <p>
                      🍪 <strong>Cookie Data:</strong> {claim.cookieData}
                    </p>
                    <p className="ml-2 text-gray-500 text-xs">
                      [Claimed: {new Date(claim.claimedAt).toLocaleString()}]
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;