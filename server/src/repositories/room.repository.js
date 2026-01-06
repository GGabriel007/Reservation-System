import mongoose, { get } from "mongoose";
import { Room } from "../models/room.model.js";

export const UserRepo = {
  /**
   * Get all rooms
   * @returns {Promise<Array>} Array of all room documents
   */
  getAllRooms: () => Room.find().populate("hotel"),

  /**
   * get room by room ID
   * @param {Number} roomId - The room ID to search for
   * @returns {Promise<Object>} Room document based on room number
   */
  getRoomById: (roomId) => {
    return Room.findById(roomId).populate("hotel");
  },

  /**
   * Get rooms by room name
   * @param {String} roomName - The room name to search for
   * @returns {Promise<Array>} Array of room documents with the specified room name
   */
  getRoomsByRoomName: (roomName) => {
    return Room.find({ roomName: roomName }).populate("hotel");
  },

  /**
   * Get rooms by hotel ID
   * @param {Number} hotelId - The hotel ID to search for
   * @returns {Promise<Array>} Array of room documents for the specified hotel
   */
  getRoomsByHotelId: (hotelId) => {
    return Room.find({ hotel: hotelId }).populate("hotel");
  },

  /**
   * Create a new room
   * @param {Object} roomData - The data for the new room
   * @returns {Promise<Object>} Created room document
   */
  createRoom: (roomData) => {
    return Room.create(roomData);
  },

  /**
   * Update room by ID
   * @param {Number} roomId - The room ID to update
   * @param {Object} updateData - The data to update the room with
   * @returns {Promise<Object>} Updated room document
   */
  updateRoomById: (roomId, updateData) => {
    return Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
    });
  },

  /**
   * Update room amenities by ID
   * @param {Number} roomId - The room ID to update
   * @param {Array} amenities - The amenities to add to the room
   * @returns {Promise<Object>} Updated room document
   */
  appendRoomAmenitiesById: (roomId, amenities) => {
    return Room.findByIdAndUpdate(
      roomId,
      { $push: { amenities: amenities } },
      { new: true }
    );
  },

  /**
   * Update room images by ID
   * @param {Number} roomId - The room ID to update
   * @param {Array} images - The images to add to the room
   * @returns {Promise<Object>} Updated room document
   */
  appendRoomImagesById: (roomId, images) => {
    return Room.findByIdAndUpdate(
      roomId,
      { $push: { images: images } },
      { new: true }
    );
  },

  /**
   * Delete room by ID
   * @param {Number} roomId - The room ID to delete
   * @returns {Promise<Object>} Deleted room document
   */
  deleteHotelById: (roomId) => {
    return Room.findByIdAndDelete(roomId);
  },

  /**
   * Filter rooms by various criteria
   * @param {Object} filters - The filter criteria
   * @returns {Promise<Array>} Array of room documents matching the filters
   */
  filterByRoomType: (roomType) => {
    return Room.find({ roomType: roomType });
  },

  /**
   * Filter rooms by price range
   * @param {Number} minPrice - Minimum price
   * @param {Number} maxPrice - Maximum price
   * @returns {Promise<Array>} Array of room documents within the price range
   */
  filterByPriceRange: (minPrice, maxPrice) => {
    return Room.find({ price: { $gte: minPrice, $lte: maxPrice } });
  },

  /**
   * Filter rooms by number of guests
   * @param {Number} numGuests - Minimum number of guests
   * @returns {Promise<Array>} Array of room documents that can accommodate the specified number of guests
   */
  filterByNumGuests: (numGuests) => {
    return Room.find({ numGuests: { $gte: numGuests } });
  },

  /**
   * Filter rooms by availability status
   * @param {String} status - Availability status ('available', 'occupied', 'maintenance')
   * @returns {Promise<Array>} Array of room documents matching the availability status
   */
  filterByAvailabilityStatus: (status) => {
    return Room.find({ availabilityStatus: status });
  },

  /**
   * Search rooms by name
   * @param {String} searchCriteria - Search string for room name
   * @returns {Promise<Array>} Array of room documents matching the search criteria
   */
  findRoomsBySearch: (searchCriteria) => {
    return Room.find({
      $or: [{ roomName: { $regex: searchCriteria, $options: "i" } }],
    });
  },

  /**
   * Get number of rooms by room name
   * @param {String} roomName - The room name to search for
   * @returns {Promise<Number>} Count of room documents with the specified room name
   */
  getNumberOfRoomsByRoomName: (roomName) => {
    return Room.countDocuments({ roomName: roomName });
  },
};
