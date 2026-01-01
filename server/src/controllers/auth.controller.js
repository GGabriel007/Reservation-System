import { UserRepo } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";

export const AuthController = {
  /**
   * Get all Auth users.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers: async (req, res) => {
    const auth = await UserRepo.getAllAuths();
    res.json(auth);
  },
  /**
   * Find Auth user by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getUserByName: async (req, res) => {
    const auth = await UserRepo.getAllAuths();
    res.json(auth);
  },
  /**
   * Create a new Auth user.
   * @param {import('express').Request} req (with body: { username, password })
   * @param {import('express').Response} res
   *
   */
  createUser: async (req, res) => {
    const { username, password } = req.body;

    // encrypt the password and save the user to the database
    try {
      // first parameter is the thing to has, second is the rounds of salt
      const encrptyedPassword = await bcrypt.hash(password, 10);

      // write to db
      await UserRepo.createUser({
        username: username,
        password: encrptyedPassword,
      });

      // return to the client
      res.status(200).json({ message: "User registration was successful! " });
    } catch (error) {
      res.status(500).json({ message: "Registration failed. " });
    }
  },
};
