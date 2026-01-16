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
import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import fs from 'fs';


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
         
        "http://liore.us-east-1.elasticbeanstalk.com",
      ];
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
      secure: false,  
      sameSite: "lax", 
    },
    store: MongoStore.create({
      mongoUrl: process.env.NODE_ENV === "production" ? process.env.MONGO_URL : process.env.MONGO_LOCAL_URL,
      ttl: 14 * 24 * 60 * 60,
      mongoOptions: process.env.NODE_ENV === "production" ? {
        tlsCAFile: path.join(process.cwd(), "global-bundle.pem")
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

const uploadsPath = path.join(__dirname, "../uploads");

// Debugging Log: tells us exactly where the server is looking
console.log("------------------------------------------------");
console.log("📂 STATIC FILES DEBUG");
console.log("Looking for uploads at:", uploadsPath);

if (fs.existsSync(uploadsPath)) {
  console.log("✅ Folder exists!");
  const files = fs.readdirSync(uploadsPath);
  console.log(`📄 File count: ${files.length}`);
  if (files.length > 0) console.log("Example file:", files[0]);
} else {
  console.error("❌ ERROR: The 'uploads' folder does NOT exist at this path.");
  console.error("   Please check if your uploads are saving to the project root instead.");
}
console.log("------------------------------------------------");

app.use("/uploads", express.static(uploadsPath));

app.use("/uploads", (req, res) => {
  console.log(`[Warning] Missing image requested: ${req.originalUrl}`);
  return res.status(404).send("Image not found");
});
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/hotels", hotelRoutes);      
app.use("/rooms", roomRoutes);   
app.use("/reservations", reservationRoutes); 
app.use("/transactions", transactionRoutes); 
app.use("/users", userRoutes);
app.use("/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.send("Online and Connected!");
});

// --- ALL-IN-ONE FRONTEND SERVING ---
const distPath = path.join(process.cwd(), 'client-build', 'dist');
app.use(express.static(distPath));


/**
 * The "Catch-all" route (FIXED FOR EXPRESS 5)
 * In Express 5, we use '*splat' instead of just '*'
 * This sends the index.html for any request that isn't an API call.
 */
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            console.error("ERROR: index.html not found at:", path.join(distPath, 'index.html'));
            res.status(500).send("Frontend files missing. Check if client-build/dist exists.");
        }
    });
});


export default app;