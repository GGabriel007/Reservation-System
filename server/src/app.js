import express from "express";
import cors from "cors";
import session from "express-session";
import passportGoogleAuth from "./auth/passport-middleware/passportGoogleAuth.js";
import "./auth/passport-strategies/googleStrategy.js";
import "./auth/passport-strategies/localStrategy.js";
import MongoStore from "connect-mongo";
import db from "./config/db.js";
import passport from "passport";

// import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/** PASSPORT **/
app.use(
  session({
    name: "sid",
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10000 * 60, // 10 minute for testing
      secure: false, // true in production with HTTPS
    },
    store: MongoStore.create({
      client: db.then((ele) => ele.getClient()),
    }),
  })
);

/** DELETE AFTER PRODUCTION **/
app.get("/", (req, res) => {
  req.session.visited = true;
  res.send("hello world testing");
});

// then we tell the app to use Passport
app.use(passport.initialize());
app.use(passport.session());

/** ROUTES **/
app.use("/auth", authRoutes);

// app.use("/admin", adminRoutes);

export default app;
