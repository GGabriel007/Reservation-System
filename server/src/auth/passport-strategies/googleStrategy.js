import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

// we set up our Google connection information here
const googleStrategy = new GoogleStrategy(
  {
    scope: ["profile", "email"], // what we're requesting from Google about the user
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5050/auth/google/callback"
        : "", // this URL must match the one set in the Google Developer Console
  },
  async (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
);

passport.use(googleStrategy);

// // in order for sessions to work, we need to be able to serialize and deserialize the user
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

export default googleStrategy;
