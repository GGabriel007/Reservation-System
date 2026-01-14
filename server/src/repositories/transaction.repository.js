import { Transaction } from "../models/transaction.model.js";

export const TransactionRepository = {
  
  // CREATE
  create: async (data) => {
    return await Transaction.create(data);
  },

  // GET ALL (Global Admin)
  // We populate here so the dashboard shows real names
  findAll: async () => {
    return await Transaction.find()
      .populate("userId", "firstName lastName email") 
      .populate("hotelId", "name city")
      .populate("reservationId", "confirmationCode")
      .sort({ createdAt: -1 });
  },

  // GET BY USER (Guest History)
  findByUserId: async (userId) => {
    return await Transaction.find({ userId })
      .populate("hotelId", "name city") 
      .populate("reservationId", "confirmationCode checkIn checkOut")
      .sort({ createdAt: -1 });
  },

  // GET BY HOTEL (Manager Report)
  findByHotelId: async (hotelId) => {
    return await Transaction.find({ hotelId })
      .populate("userId", "firstName lastName email")
      .populate("reservationId", "confirmationCode")
      .sort({ createdAt: -1 });
  },

  // GET ONE
  findById: async (id) => {
    return await Transaction.findById(id)
      .populate("userId", "firstName lastName email")
      .populate("hotelId", "name address")
      .populate("reservationId");
  },

  // UPDATE STATUS
  updateStatus: async (id, status) => {
    return await Transaction.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
  }
};