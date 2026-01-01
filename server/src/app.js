import express from "express";
import cors from "cors";
import session from "express-session";
//import passportGoogleAuth from "./auth/passport-middleware/passportGoogleAuth.js";
import passportStatelessAuth from "./auth/passport-middleware/passportStatelessAuth.js";
//import googleStrategy from "./auth/passport-strategies/passportGoogleStrategy.js";
import localStrategy from "./auth/passport-strategies/localStrategy.js";
import passport from "passport";

//import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

/** DELETE AFTER PRODUCTION **/
app.get("/", (req, res) => {
  res.send("hello world testing");
});

/** PASSPORT **/
passport.use(localStrategy);
//passport.use(googleStrategy);

// then we tell the app to use Passport
app.use(passport.initialize());

/** ROUTES **/
app.use("/auth", authRoutes);

//app.use("/admin", adminRoutes);

export default app;
