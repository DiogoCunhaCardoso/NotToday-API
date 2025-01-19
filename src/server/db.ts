import mongoose from "mongoose";

import { config } from "../utils/initEnv.js";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Ensure MONGO_URI is properly set in the environment
    const mongoURI = config.MONGO_URI;

    if (!mongoURI) return; // the error message is handled by config

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
