import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CouponContext = createContext();

export const useCoupons = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [guestCoupons, setGuestCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); 
  const [claimedCoupons, setClaimedCoupons] = useState([]); 
  const [claimHistory, setClaimHistory] = useState([]); 

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001";


  useEffect(() => {
    if (token) {
      fetchCoupons(); 
      fetchClaimHistory(); 
    } else {
      fetchAvailableCoupons();
    }
  }, [token]); 

  //  Fetch Coupons (Admin)
  const fetchCoupons = async () => {
    if (!token) return; 
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/coupons`, {
        headers: { "x-auth-token": token },
      });
      setCoupons(res.data);
    } catch (error) {
      toast.error("Failed to fetch admin coupons.");
    } finally {
      setLoading(false);
    }
  };
  const fetchClaimHistory = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/claim-history`, {
        headers: { "x-auth-token": token },
      });
      setClaimHistory(res.data); 
    } catch (error) {
      toast.error("Failed to fetch claim history.");
    }
  };

  // Fetch Available Coupons (Guest View)
  const fetchAvailableCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/coupons/available`);
      setGuestCoupons(res.data);
    } catch (error) {
      toast.error("Failed to fetch available coupons.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Claimed Coupons (Admin View)
  const fetchClaimedCoupons = async () => {
   
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/coupons/claimed`);
      console.log("Claimed Coupons:", res.data); 
      setClaimedCoupons(res.data);
    } catch (error) {
      toast.error("Failed to fetch claimed coupons.");
    } finally {
      setLoading(false);
    }
  };

  

  // Add Coupon (Admin Only)
  const addCoupon = async (newCoupon) => {
    if (!newCoupon.name.trim() || !newCoupon.code.trim()) {
      toast.warning("Both Name and Code are required.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("Token not found. Please log in again.");
        return;
      }
    
    try { 
       
      await axios.post(
        `${BASE_URL}/api/admin/add-coupon`,
        { ...newCoupon, isActive: true },
        { headers: { "x-auth-token": token } }
      );
      toast.success("Coupon added successfully!");
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add coupon.");
    }
  };

  // Toggle Coupon Status (Admin)
  const toggleCouponStatus = async (couponId, isActive) => {
    //console.log(`${BASE_URL}/api/admin/toggle-coupon/${couponId}`);
    try {
      await axios.put(
       `${BASE_URL}/api/admin/toggle-coupon/${couponId}`,
        { isActive: !isActive },
        { headers: { "x-auth-token": token } }
      );
      toast.success("Coupon status updated!");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update coupon status.");
    }
  };

  // Update Coupon (Admin)
  const updateCoupon = async (coupon) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/update-coupon/${coupon._id}`,
        coupon,
        { headers: { "x-auth-token": token } }
      );
      toast.success("Coupon updated successfully!");
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update coupon.");
    }
  };

  // Delete Coupon (Admin)
  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/admin/delete-coupon/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
  };
// Fetch Available Coupons (Guest View)
const fetchGuestCoupons = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/coupons/available`);
    setGuestCoupons(res.data); 
  } catch (error) {
    toast.error("Failed to fetch available coupons.");
  } finally {
    setLoading(false);
  }
};

  return (
    <CouponContext.Provider
      value={{
        coupons,
        guestCoupons,
        claimedCoupons,
        claimHistory,
        loading,
        fetchClaimHistory,
        fetchClaimedCoupons,
        fetchGuestCoupons,
        addCoupon,
        toggleCouponStatus,
        updateCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};
