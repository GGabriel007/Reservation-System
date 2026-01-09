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
  
  // Placeholder logic: If you want to bypass security during development, 
  // you could just call next(). For now, let's keep it safe:
  res.status(401).json({ message: "Not authorized, please login" });
};