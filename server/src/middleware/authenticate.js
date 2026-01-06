/**
 * Authentication Guard Middleware
 * * Verifies if the request contains a valid session via Passport.
 * If authenticated, it allows the request to proceed to the next handler.
 * If not, it returns a 401 Unauthorized status for the React frontend to handle.
 */

export default function ensureAuthenticated(req, res, next) {
  // Passport provides the isAuthenticated() helper to check the session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

/**
   * Return a 401 Unauthorized status.
   * Send JSON instead of a redirect (302) to allow the React frontend 
   * to catch the error in a try/catch block and handle navigation.
   */
  res.status(401).json({ 
    message: "Unauthorized: Please log in to access this resource.",
    loginOptions: {
      google: "/auth/google/login",
      local: "/auth/local/login"
    }
  });
}