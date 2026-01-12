import { ReservationService } from "../services/reservation.service.js";

/**
 * ReservationController
 * Updated to handle the expanded Lioré checkout data.
 */
export const ReservationController = {

  // CREATE RESERVATION (Supports Guest & User)
  createReservation: async (req, res) => {
    try {
      const {
        firstName, lastName, email, phone, // Box 1: Guest Info
        country, city, zipCode,           // Box 1: Address
        nameOnCard, cardNumber,           // Box 1: Payment
        newsletter,                       // Box 3: Acknowledgment
        roomId, hotelId, checkIn, checkOut,
        roomPrice, tax, fees, totalAmount
      } = req.body;

      const reservationData = {
        // 1. Identity
        userId: req.user ? req.user.id : null,
        guestFirstName: firstName,
        guestLastName: lastName,
        guestEmail: email,
        guestPhone: phone,

        // 2. Structured Address
        guestAddress: {
          country: country || "USA",
          city,
          zipCode
        },

        // 3. Stay & Room info
        roomId,
        hotelId,
        checkIn,
        checkOut,

        // 4. Financials
        roomPrice,
        tax,
        fees,
        totalAmount,

        // 5. Payment Reference (Security: Only store cardholder name and last 4)
        paymentInfo: {
          cardHolderName: nameOnCard,
          lastFour: cardNumber ? cardNumber.slice(-4) : null
        },

        // 6. Preferences
        newsletterSubscription: newsletter === true || newsletter === 'true',
        
        // Pass the rest (adults, children, etc.)
        ...req.body
      };
      
      const newReservation = await ReservationService.createReservation(reservationData);
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: "Booking failed", error: error.message });
    }
  },



  // GET GUEST'S OWN BOOKINGS
  getMyReservations: async (req, res) => {
    try {
      // Call getReservationsByUser instead of getAllReservations
      const reservations = await ReservationService.getReservationsByUser(req.user.id);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching your history", error: error.message });
    }
  },

  // GET RESERVATION BY ID
  getReservationById: async (req, res) => {
    try {
      const reservation = await ReservationService.getReservationById(req.params.id);
      
      // Basic security check: Only the owner or staff can see details
      // Updated to check guestEmail for non-logged-in users
      const isOwner = req.user && (reservation.userId?.toString() === req.user.id || reservation.guestEmail === req.user.email);
      const isStaff = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

      if (!isOwner && !isStaff) {
        return res.status(403).json({ message: "Unauthorized access to this booking" });
      }

      res.status(200).json(reservation);
    } catch (error) {
      res.status(404).json({ message: "Reservation not found", error: error.message });
    }
  },

  // CANCEL RESERVATION (Dual-Path)
  cancelReservation: async (req, res) => {
    try {
      // Path A: Logged in User
      if (req.user) {
        const cancelled = await ReservationService.cancelReservation(req.params.id, req.user.id, req.user.role);
        return res.status(200).json({ message: "Reservation cancelled", data: cancelled });
      }

      // Path B: Anonymous Guest (Needs confirmation details in req.body)
      const { confirmationCode, email } = req.body;
      if (!confirmationCode || !email) {
        return res.status(400).json({ message: "Confirmation code and email required to cancel as guest." });
      }

      const cancelled = await ReservationService.cancelReservationByGuest(req.params.id, confirmationCode, email);
      res.status(200).json({ message: "Reservation cancelled successfully", data: cancelled });
    } catch (error) {
      res.status(400).json({ message: "Cancellation failed", error: error.message });
    }
  },

  // MODIFY RESERVATION 
  modifyReservation: async (req, res) => {
    try {
      const reservationId = req.params.id;
      const updates = req.body; // e.g., { startDate, endDate, roomType }

      // Security Check
      if (!req.user && (!updates.confirmationCode || !updates.email)) {
        return res.status(401).json({ message: "Authentication or Confirmation details required to modify." });
      }

      const updated = await ReservationService.modifyReservation(reservationId, updates, req.user);
      res.status(200).json({ message: "Reservation updated successfully", data: updated });
    } catch (error) {
      res.status(400).json({ message: "Modification failed", error: error.message });
    }
  },

  // GET ALL (ADMIN ONLY)
  getAllReservations: async (req, res) => {
    try {
      const allBookings = await ReservationService.getAllReservations();
      res.status(200).json(allBookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching global records", error: error.message });
    }
  },

  // GET BY HOTEL (MANAGER/ADMIN)
  getReservationsByHotel: async (req, res) => {
    try {
      const bookings = await ReservationService.getReservationsByHotel(req.params.hotelId);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotel records", error: error.message });
    }
  },

  // GUEST LOOKUP
  getReservationByLookup: async (req, res) => {
    try {
      const { confirmationCode, lastName, email } = req.query;
      if (!confirmationCode || !lastName || !email) {
        return res.status(400).json({ message: "All search fields are required" });
      }

      const reservation = await ReservationService.lookupReservation(
        confirmationCode.toUpperCase(), 
        lastName, 
        email.toLowerCase()
      );
      
      res.status(200).json(reservation);
    } catch (error) {
      const status = error.message.includes("not match") ? 401 : 404;
      res.status(status).json({ message: error.message });
    }
  },

  // UPDATE STATUS (ADMIN/MANAGER)
  updateStatus: async (req, res) => {
    try {
      const updated = await ReservationService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: "Failed to update status", error: error.message });
    }
  }
};