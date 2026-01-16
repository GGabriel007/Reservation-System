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
   * Fetches all active rooms across all rooms that's sorted
   * also provide search capabilities
   */
  getAllRoomsSorted: async (sorted, option, search, filters, capacity) => {
    const rooms = await RoomRepository.findAllSorted(
      sorted,
      option,
      search,
      filters,
      capacity
    );
    return rooms;
  },

  getAllRoomAmenities: async () => {
    return await RoomRepository.getAllRoomAmenities();
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
   * CREATE ROOM
   * Added: Enum validation and duplicate room name check.
   */
  createRoom: async (roomData) => {
    // 1. Validate Room Type (Matches your updated Model Enums)
    const validTypes = [
      "Single",
      "Double",
      "Suite",
      "Deluxe",
      "Penthouse",
      "Studio",
    ];
    if (roomData.roomType && !validTypes.includes(roomData.roomType)) {
      throw new Error(
        `Invalid Room Type. Must be one of: ${validTypes.join(", ")}`
      );
    }

    // 2. Validate Price
    const price = roomData.basePrice ?? roomData.price;
    if (price !== undefined && price < 0) {
      throw new Error("Price cannot be negative");
    }

    // 3. Unique Room Name Check (Prevents two "Room 101" in the same hotel)
    const existingRooms = await RoomRepository.findByHotelId(roomData.hotelId);
    const isDuplicate = existingRooms.some(
      (r) => r.roomName.toLowerCase() === roomData.roomName.trim().toLowerCase()
    );
    if (isDuplicate) {
      throw new Error(
        `A room with the name "${roomData.roomName}" already exists in this hotel.`
      );
    }

    // 4. Format and Save
    const formattedData = {
      ...roomData,
      roomName: roomData.roomName.trim(),
    };

    return await RoomRepository.create(formattedData);
  },

  /**
   * UPDATE ROOM
   * Added: Logic to prevent room name conflicts during edit.
   */
  updateRoom: async (id, updateData) => {
    if (updateData.isDeleted !== undefined) delete updateData.isDeleted;

    // If updating name, check for conflicts excluding itself
    if (updateData.roomName) {
      const currentRoom = await RoomRepository.findById(id);
      const hotelRooms = await RoomRepository.findByHotelId(
        currentRoom.hotelId
      );

      const isDuplicate = hotelRooms.some(
        (r) =>
          r._id.toString() !== id &&
          r.roomName.toLowerCase() === updateData.roomName.trim().toLowerCase()
      );

      if (isDuplicate) {
        throw new Error("Another room in this hotel already uses that name.");
      }
      updateData.roomName = updateData.roomName.trim();
    }

    return await RoomRepository.update(id, updateData);
  },

  deleteRoom: async (id) => {
    return await RoomRepository.softDelete(id);
  },
};
