// this file lays out the startegy via whieh Passport wil authenticate our users
// we import the strategy from the appropriate passport package, the DB connection info ,and the bcrpt founctionality
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { UserRepo } from "../../repositories/user.repository.js";

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    // check if the username is in the db

    const user = await UserRepo.getUserByUsername(username);
    if (user.length === 0) {
      // to get out, return done(<error>, <valid user object or false>, <options like this message>)
      return done(null, false, { message: "User does not exist!" });
    }

    // check if the passwords match
    // for bcrpyt.compare(), the unencypted password MUST come first
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return done(null, false, { message: "Password does not match!" });
    }

    // once everything is good, return done and include the user
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export default localStrategy;
