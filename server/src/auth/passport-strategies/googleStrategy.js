import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../models/user.model.js";

/**
 * Google OAuth2 Strategy Configuration
 * This strategy handles the handshake between your application and Google's servers.
 * It uses environment variables for sensitive credentials to maintain security.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Search for an existing user based on their unique Google Identity ID
        let user = await User.findOne({ googleId: profile.id });

        // If no user is found, initialize a new account using profile data from Google
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            loginMethod: "google",
            role: "guest",
          });
        } else {
          // Maintenance: Ensure the loginMethod is updated to 'google' for existing users
          if (user.loginMethod !== "google") {
            user.loginMethod = "google";
            await user.save();
          }
        }

        // Successfully authenticated Pass the user record to Passport
        return done(null, user);
      } catch (err) {
        console.error("Google Strategy Authentication Error:", err);
        return done(err, null);
      }
    }
  )
);