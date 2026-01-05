import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js"; 
import localAuth from "../auth/passport-middleware/localAuth.js"; 
import ensureAuthenticated from "../middleware/authenticate.js"; 

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Creates a new user account with a hashed password.
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists to avoid duplicates
    const existingUser = await User.findOne({ email: username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Securely hash the password before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email: username,
      password: hashedPassword,
      loginMethod: "local",
      role: "guest"
    });

    res.status(201).json({ message: "User created successfully!", userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

/**
 * @route   POST /auth/local/login
 * @desc    Authenticates local credentials via Passport middleware.
 */
router.post("/local/login", localAuth, (req, res) => {
  // Passport populates req.user after successful authentication in localAuth
  console.log("Login finalized, sending response to frontend");
  const userResponse = {
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role || "User"
  };

  res.status(200).json({ 
    message: "Logged in successfully", 
    user: userResponse 
  });
});

/**
 * @route   GET /auth/google/login
 * @desc    Initiates the Google OAuth2 authentication flow.
 */
router.get("/google/login", passport.authenticate("google", {
  scope: ["profile", "email"],
}));


/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth2 callback URL. Handles session persistence and redirection.
 */
router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    // Manually save session to ensure store is updated before redirecting the client
    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
        return res.redirect("http://localhost:5173/login");
      }
      res.redirect("http://localhost:5173/user");
    });
  }
);

/**
 * @route   GET /auth/need
 * @desc    Identity check route. Returns authenticated user data.
 */
router.get("/need", ensureAuthenticated, (req, res) => {
  res.send(req.user);
});

/**
 * @route   GET /auth/logout
 * @desc    Terminates the session and clears the client-side session cookie.
 */
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      // Clear the session cookie ('sid') to ensure client is fully logged out
      res.clearCookie("sid"); 
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;