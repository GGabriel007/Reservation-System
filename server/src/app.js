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

// Required for AWS EC2/ALB to pass through headers
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://project-2-tioca-20251117-gg-sn.s3-website-us-east-1.amazonaws.com",
        "http://ec2-54-210-167-76.compute-1.amazonaws.com"
      ];
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
      secure: false, // Must be false for http://
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

/** * 🔍 DEBUG MIDDLEWARE 
 * This logs every request to your EC2 console so we can see the "Handshake"
 */
app.use((req, res, next) => {
  console.log("--- New Request ---");
  console.log(`Path: ${req.path}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Is Authenticated: ${req.isAuthenticated()}`);
  console.log(`User in Session: ${req.user ? req.user.email : "NONE"}`);
  console.log("Cookies received:", req.headers.cookie || "NO COOKIES RECEIVED");
  console.log("-------------------");
  next();
});

app.get("/", (req, res) => {
  res.send("Server is alive and logging.");
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;