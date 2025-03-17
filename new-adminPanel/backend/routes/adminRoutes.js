import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Coupon from "../models/Coupon.js";

const router = express.Router();

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  if (password !== admin.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware: Admin Authentication
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

//View All Coupons
router.get("/admin/coupons", auth, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a New Coupon
router.post("/admin/add-coupon", auth, async (req, res) => {
  const { name, code } = req.body;

  try {
    if (!name || !code) {
      return res.status(400).json({ message: "Name and Code are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists!" });
    }

    const newCoupon = new Coupon({ name, code, status: "active" }); // ✅ Ensure new coupons are active
    await newCoupon.save();

    res.json({ message: "Coupon added successfully!", coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Toggle Coupon Status
router.put("/admin/toggle-coupon/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
  
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      const coupon = await Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
  
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  
      res.json({ message: "Coupon status updated", coupon });
    } catch (error) {
      console.error("Toggle Coupon Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Update a Coupon (Code or Name)
router.put("/admin/update-coupon/:id", auth, async (req, res) => {
  const { name, code } = req.body;

  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found!" });

    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists!" });
      }
      coupon.code = code;
    }

    if (name) coupon.name = name;
    
    await coupon.save();
    const updatedCoupon = await Coupon.findById(req.params.id).populate('claims');
   

    res.json({ message: "Coupon updated successfully!", coupon:updatedCoupon });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete a Coupon
router.delete("/admin/delete-coupon/:id", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found!" });

    res.json({ message: "Coupon deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// View Claim History 
router.get("/admin/claim-history", auth, async (req, res) => {
    try {
      const claimedCoupons = await Coupon.find({ "claims.0": { $exists: true } }) // Ensure there are claims
        .select("name code claims") 
        .exec(); 
  
  
  
      res.json(claimedCoupons); 
    } catch (err) {
      console.error("Error fetching claim history:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  
  



export default router;
