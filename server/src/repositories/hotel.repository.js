import { Hotel } from "../models/hotel.model.js";

/**
 * HotelRepository
 * Direct database access for the Hotel collection.
 * Only CRUD operations happen here.
 */
export const HotelRepository = {
  /**
   * Get all Hotels
   * Note: The 'pre-find' middleware in hotel.model.js 
   * will automatically filter out isDeleted: true.
   */
  findAll: async () => {
    return await Hotel.find();
  },

  /**
   * Find a specific hotel by its unique ID
   */
  findById: async (id) => {
    return await Hotel.findById(id);
  },

  /**
   * Create a new hotel document
   */
  create: async (hotelData) => {
    return await Hotel.create(hotelData);
  },

  /**
   * Update a hotel by ID
   * { new: true } returns the document AFTER the update is applied
   */
  update: async (id, updateData) => {
    return await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Ensures the update follows your Schema rules
    });
  },

  /**
   * Soft Delete a hotel
   * Instead of removing from DB, we flip the isDeleted flag.
   */
  softDelete: async (id) => {
    return await Hotel.findByIdAndUpdate(
      id, 
      { isDeleted: true }, 
      { new: true }
    );
  },

  /**
   * Optional: Search by Name (Useful for specific lookups)
   */
  findByName: async (hotelName) => {
    return await Hotel.findOne({ name: hotelName });
  },
};