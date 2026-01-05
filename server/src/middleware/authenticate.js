// this middleware simply checks if the user is authenticated
// if they are not, it redirects them to the Google Oauth flow
export default function authMiddleware(req, res, next) {
  console.log(req.session.cookie);
  console.log(req.session.user);
  console.log(req.session.id);
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (req.originalUrl.includes("google")) res.redirect("/auth/google/login");
  res.redirect("/auth/local/login");
}
