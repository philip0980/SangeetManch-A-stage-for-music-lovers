import express, { urlencoded } from "express";
import dotenv from "dotenv";
import DatabaseConnect from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
DatabaseConnect();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", userRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
