import passport from "passport";

/**
 * Local Authentication Middleware
 * * This custom middleware wraps the Passport 'local' strategy.
 * It uses a custom callback to allow the server to return JSON responses
 * (Status 401/500) instead of default redirects, which is necessary for 
 * communication with a React frontend.
 */
const localAuth = (req, res, next) => {
  // Validate that both required credentials are present in the request body
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Execute Passport authentication with a custom callback
  passport.authenticate("local", (err, user, info) => {
    // Handle internal server or database errors
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Handle authentication failures (e.g., wrong password or user not found)
    if (!user) {
      return res.status(401).json({ 
        message: info ? info.message : "Authentication failed" 
      });
    }

    /**
     * Establish a login session manually.
     * When using a custom callback, Passport does not call req.logIn() automatically.
     * This step is what creates the session and sends the 'sid' cookie to the browser.
     */
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      
      // Proceed to the final route handler
      return next(); 
    });
  })(req, res, next);
};

export default localAuth;