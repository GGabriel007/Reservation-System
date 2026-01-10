import { RoomRepository } from "../repositories/room.repository.js";

/**
 * RoomService
 * Manages business logic for room inventory.
 * Bridges the RoomController and RoomRepository.
 */
export const RoomService = {

  /**
   * Fetches all active rooms across all hotels.
   */
  getAllRooms: async () => {
    return await RoomRepository.findAll();
  },

  /**
   * Fetches a specific room by its ID.
   */
  getRoomById: async (id) => {
    const room = await RoomRepository.findById(id);
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  },

  /**
   * Fetches all rooms belonging to a specific hotel.
   * This is the logic used when a guest views a specific property.
   */
  getRoomsByHotel: async (hotelId) => {
    return await RoomRepository.findByHotelId(hotelId);
  },

  /**
   * Business Logic for creating a room.
   * Ensures data is formatted correctly before saving.
   */
  createRoom: async (roomData) => {
    // 1. Handle price check (checking both 'price' and 'basePrice' to be safe)
    const priceToCheck = roomData.basePrice ?? roomData.price;
    if (priceToCheck !== undefined && priceToCheck < 0) {
      throw new Error("Price cannot be negative");
    }

    // 2. Defensive Formatting: 
    // We check if roomName exists before trimming to avoid the crash
    const formattedData = {
      ...roomData,
      roomName: roomData.roomName ? roomData.roomName.trim() : `Room ${roomData.roomNumber}`
    };

    return await RoomRepository.create(formattedData);
  },

  /**
   * Updates room information.
   */
  updateRoom: async (id, updateData) => {
    // Security: Prevent updating 'isDeleted' through the standard update route
    if (updateData.isDeleted !== undefined) {
      delete updateData.isDeleted;
    }

    return await RoomRepository.update(id, updateData);
  },

  /**
   * Logic for soft-deleting a room.
   */
  deleteRoom: async (id) => {
    return await RoomRepository.softDelete(id);
  }
};