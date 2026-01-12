/**
 * Auth Middleware Stub
 * For now, this just checks if Passport has authenticated the user.
 * We will refine this later with JWT or deeper session checks.
 */
export const protect = (req, res, next) => {
  // Passport usually adds an isAuthenticated() method to the request
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  /**
   * Return a 401 Unauthorized status with login options.
   * This allows the React frontend to redirect the user correctly.
   */
  return res.status(401).json({ 
    message: "Unauthorized: Please log in to access this resource.",
    loginOptions: {
      google: "/auth/google/login",
      local: "/auth/local/login"
    }
  });
};