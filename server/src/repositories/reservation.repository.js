import mongoose, { get } from "mongoose";
import { Reservation } from "../models/reservation.model.js";

export const ReservationRepository = {
  /**
   * Get all reservations
   * Includes populate so Admin can see Guest names and Hotel names.
   */
  findAll: () => {
    return Reservation.find()
      .populate("userId", "name email")
      .populate("roomId", "roomName")
      .populate("hotelId", "name");
  },

  /**
   * Get reservations by User ID
   * Essential for the "My Bookings" page.
   */
  findByUserId: (userId) => {
    return Reservation.find({ userId })
      .populate("roomId", "roomName")
      .populate("hotelId", "name");
  },

  /**
   * Get reservation by ID
   * Note: We use the MongoDB _id for consistency.
   */
  findById: (id) => {
    return Reservation.findById(id)
      .populate("userId", "name email")
      .populate("roomId")
      .populate("hotelId");
  },

  /**
   * Get reservations by Hotel (Manager View)
   */
  findByHotelId: (hotelId) => {
    return Reservation.find({ hotelId })
      .populate("userId", "name email")
      .populate("roomId", "roomName");
  },

  /**
   * Create new reservation
   */
  create: (reservationData) => {
    return Reservation.create(reservationData);
  },

  /**
   * Update Status (Soft Delete / Cancellation)
   */
  updateStatus: (id, status) => {
    return Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  },

  findByCodeWithUser: async (code) => {
    // This finds the reservation and "joins" the User document
    return await Reservation.findOne({
      confirmationCode: code.toUpperCase(),
      isDeleted: { $ne: true }
    }).populate("userId");
  },

  /**
   * FIND BY LOOKUP
   * This handles the core requirement: Guest lookup without a userId.
   */
  findForGuestLookup: (code) => {
    return Reservation.findOne({
      confirmationCode: code.toUpperCase(),
      isDeleted: { $ne: true }
    })
      .populate("userId", "firstName lastName email") // If it's a member
      .populate("roomId", "roomName roomType")
      .populate("hotelId", "name address");
  },

  /**
   * UPDATE RESERVATION
   * "Modify Reservation" task.
   */
  update: (id, updateData) => {
    return Reservation.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  },
};
