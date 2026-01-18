import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Reservation } from "../models/reservation.model.js";
import { Room } from "../models/room.model.js";

/**
 * Service: AnalyticsService
 * ----------------------------------------------------------------------
 * Aggregates data for the Admin/Manager Dashboards.
 * 
 * Responsibilities:
 * - Real-time calculation of key hotel metrics (Revenue, Occupancy).
 * - Generating chart data (Historical/Trends).
 * - Identifying system growth statistics (Total Users).
 */
export const AnalyticsService = {

  /**
    * Calculates global statistics for the admin dashboard.
    * 
    * Metrics:
    * 1. Total Revenue: Sum of all 'succeeded' transactions.
    * 2. Total Users: Count of registered guests.
    * 3. Occupancy Rate: (Active Bookings / Total Rooms) * 100.
    * 4. Revenue Trend: 6-month historical data (simulated for demo).
    * 
    * @returns {Promise<Object>} An object containing global KPI data.
    */
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
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });

      // Simulate variability
      chartData.push({
        name: monthName,
        revenue: Math.floor(Math.random() * (totalRevenue > 500 ? totalRevenue / 2 : 500)) + 2000,
        occupancy: Math.floor(Math.random() * 40) + 50 // 50-90%
      });
    }

    // Ensure the current month reflects actuals more closely
    chartData[5].revenue = totalRevenue;
    chartData[5].occupancy = occupancyRate;

    return {
      totalRevenue,
      totalUsers,
      occupancyRate,
      chartData
    };
  }
};
