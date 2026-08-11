import mongoose from "mongoose";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emergency_sos";

async function connectDB() {

try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
} catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); 
}


}
export { connectDB };