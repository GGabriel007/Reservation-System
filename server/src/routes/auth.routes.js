import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import passport from "passport";
import authMiddleware from "../middleware/authenticate.js";

const router = Router();

/**
 * Auth Routes
 * GET /auth/secure - Protected route
 * POST /auth/register - Register a new user
 * GET /auth/google/login - Initiate Google OAuth login
 * GET /auth/google/callback - Google OAuth callback
 * GET /auth/google/success - Google OAuth success
 * GET /auth/google/logout - Logout user
 */

/*** Local Basic Outh ***/

/**
 * When the user hits this endpoint, they will be use local strategy and basic auth to login
 * Method: GET
 * Endpoint: /auth/local/login
 */
router.get("/local/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "You have successfully logged in" });
});

/**
 * When the user hits this endpoint, they will be use local strategy and basic auth to login
 * Method: GET
 * Endpoint: /auth/local/login
 */
router.get("/need", authMiddleware, (req, res) => {
  console.log("in need");
  console.log(req.user);
  res.send(req.user);
});

router.post("/register", AuthController.createLocalUser);

/*** Google OAuth routes ***/

/**
 * When the user hits this endpoint, they will be redirected to Google to login
 * Method: GET
 * Endpoint: /auth/google/login
 */
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    console.log("Google login initiated");
  }
);

/**
 * This is the callback endpoint that Google will redirect the user to after they login
 * Method: GET
 * Endpoint: /auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate(
    "google", // strategy
    {
      failureRedirect: "/error", // what to do if there's an auth error
    }
  ),
  (req, res) => {
    res.json({ message: "You have successfully logged in" });
  } // what to do if they're succesful at logging in
);

/**
 * This route logs the user out by destroying their session
 * Method: GET
 * Endpoint: /auth/google/logout
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    req.logout(() => {
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
