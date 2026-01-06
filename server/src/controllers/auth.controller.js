import { UserRepo } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";

export const AuthController = {
  /**
   * Create a new Auth user.
   * @param {import('express').Request} req (with body: { username, password })
   * @param {import('express').Response} res
   */
  createLocalUser: async (req, res) => {
    const { username, password } = req.body;

    // encrypt the password and save the user to the database
    try {
      // first parameter is the thing to has, second is the rounds of salt
      const encrptyedPassword = await bcrypt.hash(password, 10);

      // write to db
      await UserRepo.createUser({
        email: username,
        password: encrptyedPassword,
      });

      // return to the client
      res.status(200).json({ message: "User registration was successful! " });
    } catch (error) {
      res.status(500).json({ message: "Registration failed. " });
    }
  },
};
