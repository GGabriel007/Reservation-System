import mongoose, { get } from "mongoose";
import { Hotel } from "../models/hotel.model.js";

export const UserRepo = {
  /**
   * Get all Hotels
   * @returns {Promise<Array>} Array of all Hotel documents
   */
  getAllHotels: () => Hotel.find(),

  /**
   * get Hotel by Hotel name
   * @param {Number} hotelName - The Hotel name to search for
   * @returns {Promise<Object>} Hotel document based on Hotel number
   */
  getHotelByName: (hotelName) => {
    return Hotel.findOne({ name: hotelName });
  },

  /**  * Update Hotel by Hotel name
   * @param {String} hotelName - The name of the hotel to update
   * @param {Object} updateData - The data to update the hotel with
   * @returns {Promise<Object>} The updated hotel document
   */
  updateHotelByName: (hotelName, updateData) => {
    return Hotel.findOneAndUpdate({ name: hotelName }, updateData, {
      new: true,
    });
  },

  /**  * Delete Hotel by Hotel name
   * @param {String} hotelName - The name of the hotel to delete
   * @returns {Promise<Object>} The deleted hotel document
   */
  deleteHotelByName: (hotelName) => {
    return Hotel.findOneAndDelete({ name: hotelName });
  },
};
