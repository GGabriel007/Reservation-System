import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import { UserRepo } from "../../repositories/user.repository.js";

/**
 * Local Authentication Strategy
 * * Defines the logic for authenticating users via email and password.
 * This strategy is triggered by the localAuth middleware.
 */
passport.use(
  new LocalStrategy(
    { usernameField: "username" }, // Map Passport's 'username' to the 'username' field in req.body
    async (username, password, done) => {
      try {
        console.log("Local Strategy: Checking for user:", username);
        
        // Verify user exists in the database via Repository
        const user = await UserRepo.getUserByEmail(username);

        if (!user) {
          console.log("Local Strategy: User not found.");
          return done(null, false, { message: "User does not exist!" });
        }

        // Compare the provided plain-text password with the stored bcrypt hash
        const matches = await bcrypt.compare(password, user.password);
        console.log("Do passwords match?", matches);

        if (!matches) {
          console.log("Local Strategy: Password mismatch.");
          return done(null, false, { message: "Password does not match!" });
        }

        // Authentication successful pass the user object to Passport for session creation
        return done(null, user);
      } catch (error) {
        console.error("Local Strategy Error:", error);
        return done(error);
      }
    }
  )
);

export default passport;