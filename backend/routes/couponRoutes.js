import express from "express";
import cookieParser from "cookie-parser";
import Coupon from "../models/Coupon.js";

const router = express.Router();


router.use(cookieParser());

// Middleware: Prevent multiple claims from the same user
const abuseCheck = async (req, res, next) => {
  const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userCookie = req.cookies.claimed;
  const { id } = req.params; // Get coupon ID from params

  console.log("Checking Abuse:");
  console.log("User IP:", userIp);
  console.log("User Cookie:", userCookie);

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found!" });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ message: "This coupon is disabled!" });
  }

  // Check if user has already claimed this coupon
  const alreadyClaimed = coupon.claims.some(
    (claim) => claim.ipAddress === userIp || claim.cookieData === userCookie
  );

  if (alreadyClaimed) {
    return res.status(429).json({ message: "You have already claimed this coupon!" });
  }

  next();
};

// Get all active coupons
router.get("/available", async (req, res) => {
    try {
      const coupons = await Coupon.find({
        isActive: true,
        claims: { $size: 0 }, 
      }).select("name code");
  
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  

// Get all claimed coupons
router.get("/claimed", async (req, res) => {
    try {
      const coupons = await Coupon.find({
        isActive: true,
        "claims.0": { $exists: true }, 
      }).select("name code claims");;
  
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  
// Claim a specific coupon
router.post("/claim/:id", abuseCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found!" });
    }

   
    const newCookie = req.cookies.claimed || new Date().getTime().toString();

   
    const newClaim = {
        cookieData: newCookie, 
        ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        claimedAt: new Date(),
    };

    coupon.claims.push(newClaim);

    await coupon.save();

   
    res.cookie("claimed", newCookie, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.json({ message: "Coupon claimed successfully!", coupon: coupon.code });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
