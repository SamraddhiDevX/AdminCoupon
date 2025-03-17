import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false }, 
  claims: [
    {
        cookieData: { type: String }, 
       ipAddress: { type: String }, 
      claimedAt: { type: Date, default: Date.now }, 
    }
  ],
});

export default mongoose.model("Coupon", CouponSchema);
