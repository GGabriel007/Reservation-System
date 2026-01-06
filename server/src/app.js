import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import db from "./config/db.js";
import "./auth/passport-config.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

/**
 * GLOBAL MIDDLEWARE
 * Configuration for cross-origin requests and body parsing.
 */

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "http://project-2-tioca-20251117-gg-sn.s3-website-us-east-1.amazonaws.com" 
      : "http://localhost:5173",
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
    secret: process.env.SESSION_SECRET || "super-secret", // Use an env var!
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax",
    },
    store: MongoStore.create({
      mongoUrl: process.env.NODE_ENV === "production" ? process.env.MONGO_URL : process.env.MONGO_LOCAL_URL,
      ttl: 14 * 24 * 60 * 60,
      mongoOptions: process.env.NODE_ENV === "production" ? {
        tlsCAFile: path.join(process.cwd(), "src/global-bundle.pem")
      } : {}
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

// Placeholder for future administration features
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;
