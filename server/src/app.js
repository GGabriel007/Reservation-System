import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import db from "./config/db.js";
import "./auth/passport-config.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// --- ES MODULE FIX FOR __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Required for AWS EC2/ALB to pass through headers (essential for cookies)
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        // Add your new Elastic Beanstalk URL here once created
        "http://liore.us-east-1.elasticbeanstalk.com",
      ];
      // When All-in-One is working, 'origin' will often be undefined for same-origin requests
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false, // Set to true only if you have HTTPS/SSL configured later
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

app.use(passport.initialize());
app.use(passport.session());

/** DEBUG MIDDLEWARE */
app.use((req, res, next) => {
  console.log("--- New Request ---");
  console.log(`Path: ${req.path}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Is Authenticated: ${req.isAuthenticated()}`);
  console.log("Cookies received:", req.headers.cookie || "NO COOKIES RECEIVED");
  console.log("-------------------");
  next();
});

// API Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// --- ALL-IN-ONE FRONTEND SERVING ---
const distPath = path.join(process.cwd(), 'client-build', 'dist');


// 1. Serve static files from the 'public' folder
// This folder should be located at: server/src/public (if you use this path)
// Note: If you put 'public' in the server root, use path.join(__dirname, '../public')
app.use(express.static(distPath));

/**
 * 2. The "Catch-all" route (FIXED FOR EXPRESS 5)
 * In Express 5, we use '*splat' instead of just '*'
 * This sends the index.html for any request that isn't an API call.
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            console.error("Error sending index.html. Path tried:", path.join(distPath, 'index.html'));
            res.status(500).send("Frontend files missing on server. Check build process.");
        }
    });
});
export default app;