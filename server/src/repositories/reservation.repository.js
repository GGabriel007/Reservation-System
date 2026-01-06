import mongoose, { get } from "mongoose";
import { Reservation } from "../models/reservation.model.js";

export const ReservationRepo = {
  /**
   * Get all reservations
   * @returns {Promise<Array>} Array of all reservation documents
   */
  getAllReservations: () => Room.find(),

  /**
   * get reservation by room number
   * @param {Number} roomNumber - The room number to search for
   * @returns {Promise<Array>} Resrvation document based on room number
   */
  getReservationsByRoomNumber: (roomNumber) => {
    return Room.find({ RoomNumber: roomNumber });
  },

  /** get reservations by user id
   * @param {ObjectId} userId - The user id to search for
   * @returns {Promise<Array>} Array of Reservation documents based on user id
   */
  getReservationsByUserId: (userId) => {
    return Reservation.find({ userId: userId });
  },

  /** get reservation by reservation number
   * @param {ObjectId} reservationNumber - The reservation number to search for
   * @returns {Promise<Object>} Reservation document based on reservation number
   */
  getReservationByReservationNumber: (reservationNumber) => {
    return Reservation.findOne({ reservationNumber: reservationNumber });
  },

  /** create new reservation
   * @param {Object} reservationData - The data for the new reservation
   * @returns {Promise<Object>} Created reservation document
   */
  createResrvation: (reservationData) => {
    return Reservation.create(reservationData);
  },

  /** update reservation by reservation number
   * @param {ObjectId} reservationNumber - The reservation number to search for
   * @param {Object} updateData - The data to update the reservation with
   * @returns {Promise<Object>} Updated reservation document
   */
  updateReservation: (reservationNumber, updateData) => {
    return Reservation.findOneAndUpdate(
      { reservationNumber: reservationNumber },
      updateData,
      { new: true }
    );
  },

  /** delete reservation by reservation number
   * @param {ObjectId} reservationNumber - The reservation number to search for
   * @returns {Promise<Object>} Deleted reservation document
   */
  deleteReservation: (reservationNumber) => {
    return Reservation.findOneAndDelete({
      reservationNumber: reservationNumber,
    });
  },
};
