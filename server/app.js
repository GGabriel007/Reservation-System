import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("hello world testing 2");
});

export default app;
