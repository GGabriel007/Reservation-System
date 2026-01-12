/**
 * Role-Based Access Control Middleware
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'manager', 'guest')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Check if user exists (should be handled by authMiddleware first)
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2. Check if the user's role is in the allowed list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access Denied: Your role (${req.user.role}) does not have permission to perform this action.` 
      });
    }

    // 3. User is authorized
    next();
  };
};