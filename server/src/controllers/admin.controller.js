import { AdminService } from "../services/adminService.js";

export const AdminController = {
  /**
   * Get all Admin users.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers: async (req, res) => {
    const admin = await AdminService.getAllAdmins();
    res.json(admin);
  },
};
