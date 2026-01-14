import { ReservationRepository } from "../repositories/reservation.repository.js";
import { RoomRepository } from "../repositories/room.repository.js";
import crypto from "crypto";

/**
 * ReservationService
 * The core logic engine for the hotel. Handles date math, 
 * pricing calculations, and booking rules.
 */
export const ReservationService = {

  /**
   * CREATE RESERVATION
   */
  createReservation: async (data) => {
    const { roomId, checkIn, checkOut } = data;

    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");

    if (room.availabilityStatus !== "available") {
      throw new Error("This room is currently not available for booking");
    }

    // 1. DATE CALCULATIONS
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();

    if (timeDiff <= 0) throw new Error("Check-out date must be after check-in date");

    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // 2. FINANCIAL CALCULATIONS
    const roomSubtotal = nights * room.basePrice;
    
    // Simulate realistic hotel math
    const tax = parseFloat((roomSubtotal * 0.12).toFixed(2)); 
    const fees = 25.00; 
    const totalAmount = roomSubtotal + tax + fees;

    // 3. GENERATE UNIQUE CONFIRMATION CODE
    const confirmationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // 4. PREPARE FINAL OBJECT
    const finalData = {
      ...data,
      hotelId: room.hotel,
      roomPrice: roomSubtotal, 
      tax,
      fees,
      totalAmount,
      confirmationCode,
      status: "confirmed" 
    };

    return await ReservationRepository.create(finalData);
  },

  /**
   * LOOKUP RESERVATION
   * Handles both User and Guest paths for the "Find My Reservation" page.
   */
  lookupReservation: async (confirmationCode, lastName, email) => {
    const reservation = await ReservationRepository.findForGuestLookup(confirmationCode);

    if (!reservation) {
      throw new Error("No reservation found with that confirmation code.");
    }

    let matches = false;

    if (reservation.userId) {
        // Path A: Registered User (Check related user model)
        const user = reservation.userId;
        matches = user.email.toLowerCase() === email.toLowerCase() && 
                  user.lastName.toLowerCase() === lastName.toLowerCase();
    } else {
        // Path B: Anonymous Guest (Check fields directly on reservation)
        matches = reservation.guestEmail.toLowerCase() === email.toLowerCase() && 
                  reservation.guestLastName.toLowerCase() === lastName.toLowerCase();
    }

    if (!matches) {
        throw new Error("The details provided do not match our records.");
    }

    return reservation;
  },

  /**
   * CANCEL RESERVATION (Logged-in User/Admin)
   * FIXED: Now uses Repository and correctly allows Admins/Managers.
   */
  cancelReservation: async (id, userId, userRole) => {
    // 1. FIX: Use ReservationRepository instead of undefined 'Reservation' model
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) throw new Error("Reservation not found");

    // 2. FIX: Explicitly allow Admins and Managers to bypass ownership checks
    const isAdminOrManager = userRole === 'admin' || userRole === 'manager';

    if (!isAdminOrManager) {
      // If not admin, check strict ownership:
      // Helper to safely get the string ID whether population occurred or not
      const ownerId = reservation.userId?._id?.toString() || reservation.userId?.toString();

      if (ownerId !== userId) {
         throw new Error("You do not have permission to cancel this booking");
      }
    }

    return await ReservationRepository.updateStatus(id, "cancelled");
  },

  /**
   * CANCEL RESERVATION (Anonymous Guest)
   * This is used after the guest provides the code and email on the frontend.
   */
  cancelReservationByGuest: async (id, confirmationCode, email) => {
    const reservation = await ReservationRepository.findById(id);
    
    if (!reservation) throw new Error("Reservation not found");

    // Safety check: ensure the code matches
    if (reservation.confirmationCode !== confirmationCode) {
      throw new Error("Invalid confirmation code for this operation.");
    }

    // Additional check: Ensure email matches (for security)
    const storedEmail = reservation.guestEmail || reservation.userId?.email;
    if (storedEmail && storedEmail.toLowerCase() !== email.toLowerCase()) {
        throw new Error("Email address does not match reservation records.");
    }
    
    return await ReservationRepository.updateStatus(id, "cancelled");
  },

  /**
   * MODIFY RESERVATION
   */
  modifyReservation: async (id, updates) => {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) throw new Error("Reservation not found");

    // If dates are changing, we must re-verify availability
    if (updates.checkIn || updates.checkOut) {
      // Logic to check overlap would go here
    }

    return await ReservationRepository.update(id, updates);
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