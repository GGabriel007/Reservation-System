import { AnalyticsService } from "../services/analytics.service.js";

export const AnalyticsController = {
  getDashboardStats: async (req, res) => {
    try {
      const stats = await AnalyticsService.getGlobalStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error("Analytics Error:", error);
      res.status(500).json({ message: "Failed to calculate dashboard stats" });
    }
  }
};