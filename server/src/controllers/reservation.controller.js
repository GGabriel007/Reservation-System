import { ReservationService } from "../services/reservation.service.js";

/**
 * ReservationController
 * Manages the lifecycle of a booking from creation to cancellation.
 */
export const ReservationController = {

  // CREATE RESERVATION
  createReservation: async (req, res) => {
    try {
      // Take the userId directly from the authenticated token for security
      const reservationData = {
        ...req.body,
        userId: req.user.id 
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
      if (req.user.role === 'guest' && reservation.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to this booking" });
      }

      res.status(200).json(reservation);
    } catch (error) {
      res.status(404).json({ message: "Reservation not found", error: error.message });
    }
  },

  // CANCEL RESERVATION
  cancelReservation: async (req, res) => {
    try {
      const cancelled = await ReservationService.cancelReservation(req.params.id, req.user.id, req.user.role);
      res.status(200).json({ message: "Reservation cancelled successfully", data: cancelled });
    } catch (error) {
      res.status(400).json({ message: "Cancellation failed", error: error.message });
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

  getReservationByLookup: async (req, res) => {
    try {
      // Data comes from the URL: /api/reservations/lookup?confirmationCode=XXX&lastName=YYY&email=ZZZ
      const { confirmationCode, lastName, email } = req.query;

      if (!confirmationCode || !lastName || !email) {
        return res.status(400).json({ message: "All search fields are required" });
      }

      const reservation = await ReservationService.lookupReservation(
        confirmationCode, 
        lastName, 
        email
      );
      
      // Success! Send the reservation data back to the frontend
      res.status(200).json(reservation);
    } catch (error) {
      // Distinguish between "Not Found" and "Wrong Details" for better UX
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