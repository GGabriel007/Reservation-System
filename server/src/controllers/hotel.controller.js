import { HotelService } from "../services/hotel.service.js";

/**
 * HotelController
 * Handles incoming HTTP requests for Hotel resources.
 * Communicates with HotelService for business logic.
 */
export const HotelController = {
  
  // GET ALL HOTELS
  getAllHotels: async (req, res) => {
    try {
      const hotels = await HotelService.getAllHotels();
      res.status(200).json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotels", error: error.message });
    }
  },

  // SINGLE HOTEL BY ID
  getHotelById: async (req, res) => {
    try {
      const hotel = await HotelService.getHotelById(req.params.id);
      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      res.status(200).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotel details", error: error.message });
    }
  },

  // CREATE NEW HOTEL (Admin Only)
  createHotel: async (req, res) => {
    try {
      const newHotel = await HotelService.createHotel(req.body);
      res.status(201).json(newHotel);
    } catch (error) {
      res.status(400).json({ message: "Failed to create hotel", error: error.message });
    }
  },

  // UPDATE HOTEL
  updateHotel: async (req, res) => {
    try {
      const updatedHotel = await HotelService.updateHotel(req.params.id, req.body);
      if (!updatedHotel) return res.status(404).json({ message: "Hotel not found" });
      res.status(200).json(updatedHotel);
    } catch (error) {
      res.status(400).json({ message: "Failed to update hotel", error: error.message });
    }
  },

  // DELETE HOTEL (Soft Delete)
  deleteHotel: async (req, res) => {
    try {
      const deletedHotel = await HotelService.deleteHotel(req.params.id);
      if (!deletedHotel) return res.status(404).json({ message: "Hotel not found" });
      res.status(200).json({ message: "Hotel successfully deactivated" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting hotel", error: error.message });
    }
  }
};