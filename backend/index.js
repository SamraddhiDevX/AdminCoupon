import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from "./routes/adminRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";



dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/api", adminRoutes);
app.use("/coupons", couponRoutes);


const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log('server is running');
  connectDB();
});
