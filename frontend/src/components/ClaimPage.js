import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableCoupons, claimCoupon } from "../api";
import { toast } from "react-toastify";

const ClaimPage = () => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [claimedCouponIds, setClaimedCouponIds] = useState(new Set()); // Track claimed coupons
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    setLoading(true);
    try {
      const coupons = await getAvailableCoupons();
      setAvailableCoupons(coupons || []);
    } catch (error) {
      toast.error("Failed to fetch available coupons.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (couponId) => {
    setClaimingId(couponId);
    try {
      const data = await claimCoupon(couponId);
      if (data?.coupon) {
        setClaimedCouponIds((prev) => new Set([...prev, couponId])); // Disable claimed coupon
        toast.success("Coupon claimed successfully!");
        fetchAvailableCoupons(); 
      } else {
        toast.error("Invalid coupon data received.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim coupon.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Available Coupons</h2>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading coupons...</p>
      ) : availableCoupons.length > 0 ? (
        <ul className="space-y-3">
          {availableCoupons.map((coupon) => (
            <li
              key={coupon._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center transition-all hover:shadow-lg"
            >
              <div>
                <p className="text-lg font-semibold">{coupon.name} - {coupon.code}</p>
              </div>
              <button
                onClick={() => handleClaim(coupon._id)}
                className={`px-4 py-2 rounded text-white transition-all ${
                  claimingId === coupon._id || claimedCouponIds.has(coupon._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={claimingId === coupon._id || claimedCouponIds.has(coupon._id)}
              >
                {claimingId === coupon._id ? "Claiming..." : claimedCouponIds.has(coupon._id) ? "Claimed" : "Claim"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No coupons available at the moment.</p>
      )}

    
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/coupons")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all"
        >
          View All Coupons
        </button>
      </div>
    </div>
  );
};

export default ClaimPage;
