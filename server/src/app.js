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

// 1. Local Test Route
app.get('/test-db', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({ 
      message: isConnected ? "Database is live!" : "Database is disconnected",
      databaseName: mongoose.connection.name,
      collections: collections.map(c => c.name) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Production AWS Status Route
app.get('/db-status', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const info = await admin.ping();
    res.json({ success: true, info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/cloud-seed', async (req, res) => {
  try {
    
    const usersCollection = mongoose.connection.collection('users');
    
    const result = await usersCollection.insertOne({
      name: "Cloud Test User",
      environment: process.env.NODE_ENV,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: "Successfully wrote to DocumentDB!",
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/cloud-data', async (req, res) => {
  try {
    const users = await mongoose.connection.collection('users').find({}).toArray();
    res.json({
      database: mongoose.connection.name,
      totalUsers: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;