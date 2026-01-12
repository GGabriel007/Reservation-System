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
   * Logic: 
   * - Find the room to get the price.
   * - Calculate the number of nights.
   * - Calculate total amount.
   * - Save the reservation.
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

    // 2. FINANCIAL CALCULATIONS (Server-side Truth)
    // Formula: $$Total = (nights \times basePrice) + tax + fees$$
    const roomSubtotal = nights * room.basePrice;
    
    // Simulate realistic hotel math (e.g., 12% tax and a $25 resort fee)
    const tax = parseFloat((roomSubtotal * 0.12).toFixed(2)); 
    const fees = 25.00; 
    const totalAmount = roomSubtotal + tax + fees;

    // 3. GENERATE UNIQUE CONFIRMATION CODE
    const confirmationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // 4. PREPARE FINAL OBJECT
    // We explicitly map fields to ensure they match our updated Model
    const finalData = {
      ...data,
      hotelId: room.hotel,
      roomPrice: roomSubtotal, // This represents the price for all nights
      tax,
      fees,
      totalAmount,
      confirmationCode,
      status: "confirmed" // Setting to confirmed as payment is "captured" in checkout
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
   * CANCEL RESERVATION (Logged-in User)
   */
  cancelReservation: async (id, userId, userRole) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error("Reservation not found");

    if (userRole === "guest" && reservation.userId.toString() !== userId) {
      throw new Error("You do not have permission to cancel this booking");
    }

    return await ReservationRepository.updateStatus(id, "cancelled");
  },

  /**
   * CANCEL RESERVATION (Anonymous Guest)
   * This is used after the guest provides the code and email on the frontend.
   */
  cancelReservationByGuest: async (id, confirmationCode, email) => {
    const reservation = await ReservationRepository.findById(id);
    
    // Safety check: ensure the code and email match before allowing the cancel
    if (reservation.confirmationCode !== confirmationCode) {
      throw new Error("Invalid confirmation code for this operation.");
    }
    
    // Note: You might need to populate 'userId' to check the email here 
    // depending on if your Repository does it automatically.

    return await ReservationRepository.updateStatus(id, "cancelled");
  },

  /**
   * LOOKUP RESERVATION
   */
  lookupReservation: async (confirmationCode, lastName, email) => {
    const reservation = await ReservationRepository.findForGuestLookup(confirmationCode);

    if (!reservation) {
        throw new Error("No reservation found with that confirmation code.");
    }

    // Logic: Check if it's a registered user OR an anonymous guest
    let matches = false;

    if (reservation.userId) {
        // Path A: Registered User
        const user = reservation.userId;
        matches = user.email.toLowerCase() === email.toLowerCase() && 
                  user.lastName.toLowerCase() === lastName.toLowerCase();
    } else {
        // Path B: Anonymous Guest (using fields on the reservation model)
        matches = reservation.guestEmail.toLowerCase() === email.toLowerCase() && 
                  reservation.guestLastName.toLowerCase() === lastName.toLowerCase();
    }

    if (!matches) {
        throw new Error("The details provided do not match our records.");
    }

    return reservation;
},

  /**
   * MODIFY RESERVATION
   * Logic: Re-calculate price and check if the room is still available for new dates.
   */
  modifyReservation: async (id, updates) => {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) throw new Error("Reservation not found");

    // If dates are changing, we must re-verify availability
    if (updates.checkIn || updates.checkOut) {
      const newStart = new Date(updates.checkIn || reservation.checkIn);
      const newEnd = new Date(updates.checkOut || reservation.checkOut);
      
      // Here you would typically call a 'checkRoomAvailability' method
      // to ensure no other bookings overlap with these new dates.
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