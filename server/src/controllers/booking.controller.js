import { BookingService } from "../services/bookingService.js";

export const BookingController = {
  /**
   * Get all Booking users.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers: async (req, res) => {
    const booking = await BookingService.getAllBookings();
    res.json(booking);
  },
};
