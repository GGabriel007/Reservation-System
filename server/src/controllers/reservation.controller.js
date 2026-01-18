import { ReservationService } from "../services/reservation.service.js";

/**
 * Controller: ReservationController
 * ----------------------------------------------------------------------
 * Handles HTTP requests for reservation operations. 
 * Bridges the Express Router to the Business Logic (Service Layer).
 * 
 * Key Functions:
 * - Create Booking (POST /)
 * - Get My Bookings (GET /my)
 * - Manager View (GET /hotel/:hotelId)
 * - Guest Lookup (GET /lookup)
 * - Cancel/Modify Operations
 */
export const ReservationController = {

  /**
   * Creates a new reservation.
   * Expects a full payload including guest info, payment details, and room selection.
   * 
   * @route POST /api/reservations
   */
  createReservation: async (req, res) => {
    try {
      const {
        guestFirstName, guestLastName, guestEmail, guestPhone, // Box 1: Guest Info
        country, city, zipCode,           // Box 1: Address
        nameOnCard, cardNumber,           // Box 1: Payment
        newsletter,                       // Box 3: Acknowledgment
        roomId, hotelId, checkIn, checkOut,
        roomPrice, tax, fees, totalAmount
      } = req.body;

      console.log("Creating reservation for:", guestFirstName, guestLastName);

      const reservationData = {
        // 1. Identity
        userId: req.user ? req.user.id : null,
        guestFirstName,
        guestLastName,
        guestEmail,
        guestPhone,

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

        // 7. Guests & Options
        adults: req.body.adults || 1,
        children: req.body.children || 0,
        bedPreference: req.body.bedPreference || "Standard",
        specialRequests: req.body.specialRequests || "None"
      };

      const newReservation = await ReservationService.createReservation(reservationData);
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: "Booking failed", error: error.message });
    }
  },



  /**
   * Retrieves all reservations for the currently logged-in user.
   * 
   * @route GET /api/reservations/my
   */
  getMyReservations: async (req, res) => {
    try {
      // Pass both ID and email to consolidate bookings
      const reservations = await ReservationService.getReservationsByUser(req.user.id, req.user.email);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching your history", error: error.message });
    }
  },

  /**
   * Retrieves all reservations for a specific hotel property.
   * Used by Managers to view their property's booking list.
   * 
   * @route GET /api/reservations/hotel/:hotelId
   */
  getHotelReservations: async (req, res) => {
    try {
      const { hotelId } = req.params; // Or get from req.user.assignedHotel

      // Find all reservations for this hotel
      // We populate 'user' to get guest name and 'room' to get room number
      const reservations = await Reservation.find({ hotelId: hotelId })
        .populate("userId", "firstName lastName email")
        .populate("room", "roomName roomType")
        .sort({ checkInDate: -1 }); // Newest first

      res.status(200).json(reservations);
    } catch (err) {
      res.status(500).json({ message: "Error fetching reservations", error: err.message });
    }
  },

  /**
   * Gets specific details of a single reservation.
   * Protected: Only the Owner, Admin, or Manager can view.
   * 
   * @route GET /api/reservations/:id
   */
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

  /**
   * Cancels a reservation.
   * Handles two scenarios:
   * 1. Logged-in User/Admin (Authenticated)
   * 2. Anonymous Guest (Requires Confirmation Code + Email)
   * 
   * @route POST /api/reservations/:id/cancel
   */
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

  /**
   * Modifies an existing reservation.
   * 
   * @route PUT /api/reservations/:id
   */
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

  /**
   * Retrieves ALL reservations in the system (Super Admin).
   * 
   * @route GET /api/reservations/all
   */
  getAllReservations: async (req, res) => {
    try {
      const allBookings = await ReservationService.getAllReservations();
      res.status(200).json(allBookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching global records", error: error.message });
    }
  },

  // GET BY HOTEL (MANAGER/ADMIN)
  // (Note: Duplicate function definition in original file? Leaving as is but documenting reuse)
  getReservationsByHotel: async (req, res) => {
    try {
      const bookings = await ReservationService.getReservationsByHotel(req.params.hotelId);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotel records", error: error.message });
    }
  },

  /**
   * Lookup for guests to find a booking without logging in.
   * 
   * @route GET /api/reservations/lookup
   * @query confirmationCode, lastName, email
   */
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

  /**
   * Manually updates the status of a reservation (Admin override).
   * 
   * @route PATCH /api/reservations/:id/status
   */
  updateStatus: async (req, res) => {
    try {
      const updated = await ReservationService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: "Failed to update status", error: error.message });
    }
  }
};
