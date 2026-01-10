import { ReservationRepository } from "../repositories/reservation.repository.js";
import { RoomRepository } from "../repositories/room.repository.js";

/**
 * ReservationService
 * The core logic engine for the hotel. Handles date math, 
 * pricing calculations, and booking rules.
 */
export const ReservationService = {

  /**
   * CREATE RESERVATION
   * Logic: 
   * - Find the room to get the price.
   * - Calculate the number of nights.
   * - Calculate total amount.
   * - Save the reservation.
   */
  createReservation: async (data) => {
    const { roomId, checkIn, checkOut } = data;

    // Get room details to find the current price
    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");
    if (room.availabilityStatus !== "available") {
      throw new Error("This room is currently not available for booking");
    }

    // Calculate Nights stay
    // Formula: (CheckOut - CheckIn) / (ms in a day)
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    
    if (timeDiff <= 0) throw new Error("Check-out date must be after check-in date");
    
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Calculate Total Amount
    // $$Total = nights \times basePrice$$
    const totalAmount = nights * room.basePrice;

    // Create the record
    const finalData = {
      ...data,
      hotelId: room.hotel, // Automatically link the hotel from the room record
      totalAmount,
      status: "pending" // Becomes 'confirmed' after Stripe payment
    };

    return await ReservationRepository.create(finalData);
  },

  /**
   * CANCEL RESERVATION
   * Logic: Update status and logic for card refunds could be added here.
   */
  cancelReservation: async (id, userId, userRole) => {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) throw new Error("Reservation not found");

    // Security check: Guests can only cancel their own bookings
    if (userRole === "guest" && reservation.userId.toString() !== userId) {
      throw new Error("You do not have permission to cancel this booking");
    }

    return await ReservationRepository.updateStatus(id, "cancelled");
  },

  lookupReservation: async (confirmationCode, lastName, email) => {
    // Fetch the reservation using the new repository method
    const reservation = await ReservationRepository.findByCodeWithUser(confirmationCode);

    // If no reservation matches that code
    if (!reservation) {
      throw new Error("No reservation found with that confirmation code");
    }

    // The 'userId' field is now a full User object thanks to .populate()
    const guest = reservation.userId;

    // Case-insensitive comparison
    const isEmailMatch = guest.email.toLowerCase() === email.toLowerCase();
    const isLastNameMatch = guest.lastName.toLowerCase() === lastName.toLowerCase();

    if (!isEmailMatch || !isLastNameMatch) {
      throw new Error("The details provided do not match our records.");
    }

    // If everything matches, return the reservation
    return reservation;
  },

  getReservationsByUser: async (userId) => {
    return await ReservationRepository.findByUserId(userId);
  },

  getReservationsByHotel: async (hotelId) => {
    return await ReservationRepository.findByHotelId(hotelId);
  },

  getReservationById: async (id) => {
    return await ReservationRepository.findById(id);
  },

  getAllReservations: async () => {
    return await ReservationRepository.findAll();
  },

  updateStatus: async (id, status) => {
    return await ReservationRepository.updateStatus(id, status);
  }
};