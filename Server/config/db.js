import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Database_URL = process.env.DATABASE_URI;

const DatabaseConnect = async () => {
  try {
    await mongoose.connect(Database_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

export default DatabaseConnect;
