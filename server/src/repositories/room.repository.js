import mongoose, { get } from "mongoose";
import { Room } from "../models/room.model.js";

/**
 * RoomRepository
 * Direct database access for the Room collection.
 * Includes population of Hotel data for detailed views.
 */
export const RoomRepository = {
  /**
   * Get all active rooms
   */
  findAll: async () => {
    // Note: Model middleware handles isDeleted: false
    return await Room.find().populate("hotel");
  },

  /**
   * Get all active rooms
   */
  findAllSorted: async (sorted, option, search) => {
    const sortOrder = sorted?.toLowerCase() === "desc" ? -1 : 1;
    const sortField = option === "name" ? "roomName" : "basePrice";

    if (search)
      return await Room.find({ roomName: { $regex: search, $options: "i" } })
        .sort({ [sortField]: sortOrder })
        .populate("hotel")
        .exec();

    return await Room.find()
      .sort({ [sortField]: sortOrder })
      .populate("hotel")
      .exec();
  },

  /**
   * Get room by ID
   */
  findById: async (id) => {
    return await Room.findById(id).populate("hotel");
  },

  /**
   * Get rooms by hotel ID
   * This is the "Key Attribute" from your checklist.
   */
  findByHotelId: async (hotelId) => {
    // 1. Convert string to ObjectId to be safe
    // 2. Search using the 'hotel' field to match your DB sample
    return await Room.find({
      hotel: new mongoose.Types.ObjectId(hotelId),
    });
  },

  /**
   * Create a new room
   */
  create: async (roomData) => {
    return await Room.create(roomData);
  },

  /**
   * Update room by ID
   */
  update: async (id, updateData) => {
    return await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },

  /**
   * Soft Delete room
   * Requirements: Inventory management without losing historical data.
   */
  softDelete: async (id) => {
    return await Room.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  },

  // --- ADVANCED FILTERING (For Search Page) ---

  /**
   * Filter by Type (single, double, suite)
   */
  findByType: async (roomType) => {
    return await Room.find({ roomType }).populate("hotel");
  },

  /**
   * Filter by Price Range
   * Uses basePrice to match your room.model.js
   */
  findByPriceRange: async (min, max) => {
    return await Room.find({
      basePrice: { $gte: min, $lte: max },
    }).populate("hotel");
  },

  /**
   * Filter by Occupancy
   * Uses maxOccupancy to match your room.model.js
   */
  findByOccupancy: async (guests) => {
    return await Room.find({
      maxOccupancy: { $gte: guests },
    }).populate("hotel");
  },
};
