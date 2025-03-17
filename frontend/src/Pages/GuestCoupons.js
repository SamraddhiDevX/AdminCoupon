import React, { useEffect, useState } from "react";
import { useCoupons } from "../Context/CouponContext";

const GuestCoupons = () => {
  const { guestCoupons, claimedCoupons, fetchGuestCoupons, loading,fetchClaimedCoupons } = useCoupons();
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching guest and claimed coupons...");
    fetchGuestCoupons();
    fetchClaimedCoupons()
      .catch(() => setError("Failed to load claimed coupons. Please try again."));
  }, []);
  console.log(claimedCoupons);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Guest Coupons</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading coupons...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
        
          <h3 className="text-lg font-semibold mb-2">Available Coupons</h3>
          {guestCoupons.length === 0 ? (
            <p className="text-gray-500">No available coupons.</p>
          ) : (
            <ul className="space-y-3">
              {guestCoupons.map((coupon) => (
                <li
                  key={coupon._id}
                  className="p-4 rounded-lg shadow flex justify-between items-center bg-green-100 border-l-4 border-green-500"
                >
                  <div>
                    <p className="text-lg font-semibold">{coupon.code}</p>
                    <p className="text-sm text-green-600">Available</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

       
          <h3 className="text-lg font-semibold mt-6 mb-2">Claimed Coupons</h3>
          {claimedCoupons.length === 0 ? (
            <p className="text-gray-500">No claimed coupons.</p>
          ) : (
            <ul className="space-y-3">
              {claimedCoupons.map((coupon) => (
                <li
                  key={coupon._id}
                  className="p-4 rounded-lg shadow flex justify-between items-center bg-yellow-100 border-l-4 border-yellow-500"
                >
                  <div>
                    <p className="text-lg font-semibold">{coupon.code}</p>
                    <p className="text-sm text-yellow-600">Claimed</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default GuestCoupons;
