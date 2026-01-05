import passport from "passport";
import "./passport-strategies/localStrategy.js";
import "./passport-strategies/googleStrategy.js";
import { UserRepo } from "../repositories/user.repository.js";

/**
 * Passport Session Configuration
 * This file handles the transition of user data between the database 
 * and the session store to maintain persistent login states.
 */

// Serialization determines which piece of data is stored in the session cookie.
// We store only the unique identifier to keep the cookie payload lightweight.
passport.serializeUser((user, done) => {
  // Supports both MongoDB ObjectId (_id) and standard id strings
  const sessionData = user._id || user.id;
  done(null, sessionData);
});

// Deserialization occurs on every subsequent request to hydrate req.user.
// It uses the ID stored in the cookie to fetch the full user record from the database.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserRepo.getUserById(id);

    if (!user) {
      return done(null, false);
    }

    // The user object found here is attached to req.user for use in routes
    done(null, user);
  } catch (err) {
    console.error("Critical Error during Passport Deserialization:", err);
    done(err);
  }
});

export default passport;