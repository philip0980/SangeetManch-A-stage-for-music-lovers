import express from "express";
import dotenv from "dotenv";
import DatabaseConnect from "./config/db.js";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello world");
});

DatabaseConnect();
const port = 8000;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
