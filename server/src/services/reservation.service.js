import { ReservationRepository } from "../repositories/reservation.repository.js";
import { RoomRepository } from "../repositories/room.repository.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import crypto from "crypto";

/**
 * Service: ReservationService
 * ----------------------------------------------------------------------
 * The central business logic layer for handling all reservation operations.
 * This service orchestrates interactions between Reservations, Rooms,
 * and Transactions (Payments).
 * 
 * Key Responsibilities:
 * - Creating reservations (calculating totals, taxes, fees)
 * - Simulating payment processing via TransactionService
 * - Handling Cancellations (including Refunds)
 * - Guest Lookup functionality
 */
export const ReservationService = {

  /**
   * Creates a new reservation, updates room availability, and processes simulated payment.
   * 
   * @param {Object} data - The raw booking payload from the frontend.
   * @param {string} data.roomId - The ID of the room being booked.
   * @param {Date} data.checkIn - Check-in date.
   * @param {Date} data.checkOut - Check-out date.
   * @param {Object} [data.paymentInfo] - Payment card details (last 4 digits).
   * @returns {Promise<Object>} The created Reservation document.
   * @throws {Error} If room is not found, unavailable, or dates are invalid.
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

    const reservation = await ReservationRepository.create(finalData);

    // 5. UPDATE ROOM STATUS TO OCCUPIED
    await RoomRepository.updateStatus(roomId, "occupied");

    // 6. [NEW] CREATE SIMULATED TRANSACTION
    // This connects the Booking to the "Payment Processing" requirement
    await TransactionRepository.create({
      reservationId: reservation._id,
      hotelId: room.hotel, // Using the ID from the room relation
      userId: reservation.userId || null, // Can be null for Guest
      stripePaymentIntentId: `pi_mock_${crypto.randomBytes(12).toString('hex')}`,
      amount: totalAmount,
      currency: "usd",
      status: "succeeded",
      paymentMethodDetails: {
        brand: "visa",
        last4: data.paymentInfo?.lastFour || "4242"
      }
    });

    return reservation;
  },

  /**
   * Retrieves a reservation for a guest using their Confirmation Code and Verification Details.
   * Supports "Cross-Matching" (checking both Guest fields and User Profile fields).
   * 
   * @param {string} confirmationCode - The 6-character booking code.
   * @param {string} lastName - The last name provided for verification.
   * @param {string} email - The email address provided for verification.
   * @returns {Promise<Object>} The matching Reservation document.
   * @throws {Error} If not found, details mismatch, or reservation is cancelled.
   */
  lookupReservation: async (confirmationCode, lastName, email) => {
    const reservation = await ReservationRepository.findForGuestLookup(confirmationCode);

    if (!reservation) {
      throw new Error("No reservation found with that confirmation code.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanLastName = lastName.trim().toLowerCase();

    // MATCHING STRATEGY: 
    // We allow "Cross-Matching". If the provided Email matches (Guest OR User Record) 
    // AND the provided LastName matches (Guest OR User Record), we consider it a match.
    // This is more user-friendly if they logged in but used a different email/name during checkout.

    const emailMatches =
      (reservation.guestEmail?.trim().toLowerCase() === cleanEmail) ||
      (reservation.userId?.email?.trim().toLowerCase() === cleanEmail);

    const lastNameMatches =
      (reservation.guestLastName?.trim().toLowerCase() === cleanLastName) ||
      (reservation.userId?.lastName?.trim().toLowerCase() === cleanLastName);

    if (reservation.status === "cancelled") {
      throw new Error("This reservation has been cancelled and is no longer available for lookup.");
    }

    if (!emailMatches || !lastNameMatches) {
      throw new Error("The details provided do not match our records.");
    }

    return reservation;
  },

  /**
   * Cancels a reservation on behalf of a Logged-in User or Admin.
   * Handles permission checks, room release, and refund triggering.
   * 
   * @param {string} id - The Reservation ID.
   * @param {string} userId - The ID of the user requesting cancellation.
   * @param {string} userRole - The role of the user (e.g., 'admin', 'manager', 'guest').
   * @returns {Promise<Object>} The updated (cancelled) Reservation.
   * @throws {Error} If reservation not found or unauthorized.
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

    const cancelled = await ReservationRepository.updateStatus(id, "cancelled");

    // 3. UPDATE ROOM STATUS TO AVAILABLE
    if (reservation.roomId) {
      // Handle populated roomId object or string ID
      const roomId = reservation.roomId._id || reservation.roomId;
      await RoomRepository.updateStatus(roomId, "available");
    }

    // 4. [NEW] REFUND TRANSACTION
    await TransactionRepository.updateStatusByReservationId(id, "refunded");

    return cancelled;
  },

  /**
   * Cancels a reservation for an anonymous Guest using verification details.
   * Used when a user is NOT logged in.
   * 
   * @param {string} id - The Reservation ID.
   * @param {string} confirmationCode - The booking code for verification.
   * @param {string} email - The email address for security verification.
   * @returns {Promise<Object>} The updated (cancelled) Reservation.
   * @throws {Error} If code/email don't match or reservation doesn't exist.
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

    const cancelled = await ReservationRepository.updateStatus(id, "cancelled");

    // 3. UPDATE ROOM STATUS TO AVAILABLE
    if (reservation.roomId) {
      // Handle populated roomId object or string ID
      const roomId = reservation.roomId._id || reservation.roomId;
      await RoomRepository.updateStatus(roomId, "available");
    }

    // 4. [NEW] REFUND TRANSACTION
    await TransactionRepository.updateStatusByReservationId(id, "refunded");

    return cancelled;
  },

  /**
   * Modifies an existing reservation (e.g., changing dates or room type).
   * 
   * @param {string} id - Reservation ID.
   * @param {Object} updates - Fields to update (e.g., checkIn, checkOut).
   * @returns {Promise<Object>} Updated Reservation.
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

  // --- GETTER HELPERS ---

  getReservationsByUser: async (userId, email) => {
    return await ReservationRepository.findByEmailOrUserId(email, userId);
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
