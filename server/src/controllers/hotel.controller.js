import { HotelService } from "../services/hotelService.js";

export const HotelController = {
  /**
   * Get all Hotel users.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers: async (req, res) => {
    const hotel = await HotelService.getAllHotels();
    res.json(hotel);
  },
};
