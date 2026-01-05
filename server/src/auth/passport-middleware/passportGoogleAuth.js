// this middleware simply checks if the user is authenticated
// if they are not, it redirects them to the Google Oauth flow
export default function passportGoogleAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // this endpoitn will be in our auth controller and will handle the next step in the flow
  res.redirect("/auth/google");
}
