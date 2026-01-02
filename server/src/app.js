import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("hello world testing connection with Backend! Welcome to updates for project 2");
});


export default app;