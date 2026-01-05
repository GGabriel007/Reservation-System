import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import db from "./config/db.js";
import "./auth/passport-config.js" // Standardizes Passport serialization/deserialization
import authRoutes from "./routes/auth.routes.js";

const app = express();

/**
 * GLOBAL MIDDLEWARE
 * Configuration for cross-origin requests and body parsing.
 */

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,              
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/**
 * SESSION MANAGEMENT
 * Persistent sessions stored in MongoDB to survive server restarts.
 */
/** PASSPORT **/
app.use(
  session({
    name: "sid",
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false, 
      sameSite: "lax",
    },
    // FIX: Use mongoUrl instead of clientPromise
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/test_db", 
      ttl: 14 * 24 * 60 * 60, // sessions last 14 days
    }),
  })
);

/** DELETE AFTER PRODUCTION **/
app.get("/", (req, res) => {
  req.session.visited = true;
  res.send("hello world testing");
});

/**
 * PASSPORT INITIALIZATION
 * Must be defined AFTER session middleware and BEFORE routes.
 */
app.use(passport.initialize());
app.use(passport.session());

/** ROUTES **/
app.use("/auth", authRoutes);

// Placeholder for future administration features
// app.use("/admin", adminRoutes);

export default app;
