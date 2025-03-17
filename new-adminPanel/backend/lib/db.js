import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;