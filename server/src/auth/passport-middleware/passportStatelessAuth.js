import passport from "passport";

const passportStatelessAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const encodedCredentials = authHeader.split(" ")[1];

  const [username, password] = Buffer.from(encodedCredentials, "base64")
    .toString()
    .split(":");

  // add credentails to request body
  // customize this for POST/PUT request, etc
  req.body = { username, password };

  // finally, we authenticate using our LocalStrategy
  // three parameters -- strategy, options, callback
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ message: "You are not authorized!" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default passportStatelessAuth;
