import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Reservation } from "../models/reservation.model.js";
import { Room } from "../models/room.model.js"; // <--- Now we use this!

export const AnalyticsService = {
  getGlobalStats: async () => {
    // 1. Calculate Total Revenue (Real money in the bank)
    const revenueResult = await Transaction.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Count Total Users (Guests only)
    const totalUsers = await User.countDocuments({ role: "guest" });

    // 3. Calculate REAL Occupancy Rate
    const today = new Date();
    
    // A. Count rooms that are currently booked
    const activeBookings = await Reservation.countDocuments({
      checkIn: { $lte: today },
      checkOut: { $gte: today },
      status: "confirmed"
    });
    
    // B. Count total physical rooms in your database
    const totalRooms = await Room.countDocuments({ isDeleted: false });

    // C. The Math (Avoid division by zero)
    const occupancyRate = totalRooms > 0 
      ? Math.round((activeBookings / totalRooms) * 100) 
      : 0;

    // 4. Generate Chart Data (Last 6 Months)
    // For now, we simulate the trend. In the future, we can aggregate this by month.
    const chartData = [
      { name: "Jan", revenue: 4000, occupancy: 65 },
      { name: "Feb", revenue: 3000, occupancy: 50 },
      { name: "Mar", revenue: 5000, occupancy: 70 },
      { name: "Apr", revenue: 7500, occupancy: 85 },
      { name: "May", revenue: 6000, occupancy: 75 },
      { name: "Jun", revenue: totalRevenue > 8000 ? totalRevenue : 8200, occupancy: occupancyRate || 80 },
    ];

    return {
      totalRevenue,
      totalUsers,
      occupancyRate,
      chartData
    };
  }
};