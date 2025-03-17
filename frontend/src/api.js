import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


const handleApiError = (error, action = "performing the request") => {
  console.error(`Error ${action}:`, error?.response?.data?.message || error.message);
  throw error;
};

// Function to claim a specific coupon by ID
export const claimCoupon = async (couponId) => {
  try {
    const response = await api.post(`/coupons/claim/${couponId}`,
        {},
        {
            withCredentials:true,
        }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "claiming the coupon");
  }
};


// Function to log in as admin
export const adminLogin = async (username, password) => {
    try {
      const response = await api.post("/api/admin/login", { username, password });
      const { token } = response.data;
  
      if (token) {
        localStorage.setItem("jwtToken", token); 
  
        api.defaults.headers.common["x-auth-token"] = token;
      }
  
      return response.data;
    } catch (error) {
      handleApiError(error, "logging in as admin");
    }
  };

// Function to get available coupons
export const getAvailableCoupons = async () => {
  try {
    const response = await api.get("/coupons/available");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching available coupons");
  }
};



// Function to attach auth token for admin routes
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete api.defaults.headers.common["x-auth-token"];
  }
};

export default api;
