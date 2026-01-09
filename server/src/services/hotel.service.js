import { HotelRepository } from "../repositories/hotel.repository.js";

/**
 * HotelService
 * Contains business logic for Hotel operations.
 * Acts as a bridge between the Controller and the Repository.
 */
export const HotelService = {

  /**
   * Fetches all active hotels.
   * Logic: The repository handles the filtering of soft-deleted items.
   */
  getAllHotels: async () => {
    return await HotelRepository.findAll();
  },

  /**
   * Fetches a specific hotel by its ID.
   */
  getHotelById: async (id) => {
    const hotel = await HotelRepository.findById(id);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    return hotel;
  },

  /**
   * Business Logic for creating a hotel.
   * Validation here, such as checking if a hotel 
   * at that specific address already exists.
   */
  createHotel: async (hotelData) => {
    // Business Logic: Ensure the hotel name is trimmed and capitalized
    const formattedData = {
      ...hotelData,
      name: hotelData.name.trim()
    };
    
    return await HotelRepository.create(formattedData);
  },

  /**
   * Updates hotel information
   */
  updateHotel: async (id, updateData) => {
    // Business Logic: Prevent updating the 'isDeleted' flag through this route
    if (updateData.isDeleted !== undefined) {
      delete updateData.isDeleted;
    }
    
    return await HotelRepository.update(id, updateData);
  },

  /**
   * Logic for soft-deleting a hotel.
   */
  deleteHotel: async (id) => {
    return await HotelRepository.softDelete(id);
  }
};