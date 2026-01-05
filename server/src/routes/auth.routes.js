import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import passport from "passport";
import authMiddleware from "../middleware/authenticate.js";
import passportStatelessAuth from "../auth/passport-middleware/passportStatelessAuth.js";

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
router.get("/local/login", passportStatelessAuth, (req, res) => {
  const { password, ...rest } = req.user._doc;
  res.json({ sessionId: req.session.id, cookie: req.session.cookie, rest });
});

/**
 * When the user hits this endpoint, they will be use local strategy and basic auth to login
 * Method: GET
 * Endpoint: /auth/local/login
 */
router.get("/need", authMiddleware, (req, res) => {
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
  })
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
    res.redirect("http://localhost:5173/user");
  } // what to do if they're succesful at logging in
);

router.get("/success", (req, res) => {
  console.log(req.user);
});

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
