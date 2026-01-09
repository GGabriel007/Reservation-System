import { User } from "../models/user.model.js";
import { Hotel } from "../models/hotel.model.js";
import { Reservation } from "../models/reservation.model.js";
import { Transaction } from "../models/transaction.model.js";

/**
 * AdminRepository
 * Handles high-level data aggregation and system-wide management queries.
 */
export const AdminRepository = {

  /**
   * Get global counts for the dashboard
   */
  getSystemCounts: async () => {
    const [users, hotels, reservations] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments({ isDeleted: false }),
      Reservation.countDocuments()
    ]);
    return { users, hotels, reservations };
  },

  /**
   * Calculate total platform revenue
   * Uses MongoDB Aggregation to sum the 'amount' field from paid transactions.
   */
  getTotalRevenue: async () => {
    const result = await Transaction.aggregate([
      { $match: { status: "paid" } },
      { 
        $group: { 
          _id: null, 
          totalAmount: { $sum: "$amount" } 
        } 
      }
    ]);
    // Return 0 if no transactions exist yet
    return result.length > 0 ? result[0].totalAmount : 0;
  },

  /**
   * Find all users for the management table
   */
  findAllUsers: async () => {
    return await User.find({}, "-password").sort({ createdAt: -1 });
  },

  /**
   * Update a user's role and assigned hotel
   */
  updateUserRole: async (userId, role, assignedHotel = null) => {
    return await User.findByIdAndUpdate(
      userId,
      { role, assignedHotel },
      { new: true, runValidators: true }
    ).select("-password");
  },

  /**
   * Get global inventory (Hotels + their Rooms)
   * This is a "Deep Query" that joins the Hotel and Room collections.
   */
  getGlobalInventoryAudit: async () => {
    return await Hotel.find({ isDeleted: false })
      .populate({
        path: "rooms",
        select: "roomName roomType basePrice availabilityStatus"
      })
      .select("name location rooms");
  }
};