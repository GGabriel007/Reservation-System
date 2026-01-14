import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import styles from "./styles.module.css";

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  occupancyRate: number;
  chartData: Array<{ name: string; revenue: number; occupancy: number }>;
}

export default function Overview() {
  const [stats, setStats] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalUsers: 0,
    occupancyRate: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  // Environment check for API URL
  const baseUrl = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com" 
    : "http://localhost:8080"; 

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${baseUrl}/analytics/dashboard`, { 
        credentials: "include" // Important: Sends the Admin Cookie
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Generating Analytics...</div>;

  return (
    <div className={styles.container}>
      
      {/* --- KPI CARDS ROW --- */}
      <div className={styles.kpiGrid}>
        
        {/* Card 1: Revenue */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Total Revenue</span>
            <span className={`${styles.icon} ${styles.iconMoney}`}>$</span>
          </div>
          <div className={styles.cardValue}>${stats.totalRevenue.toLocaleString()}</div>
          <div className={styles.cardSub}>Lifetime earnings</div>
        </div>

        {/* Card 2: Occupancy */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Occupancy Rate</span>
            <span className={`${styles.icon} ${styles.iconGraph}`}>%</span>
          </div>
          <div className={styles.cardValue}>{stats.occupancyRate}%</div>
          <div className={styles.cardSub}>Current active stays</div>
        </div>

        {/* Card 3: Users */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Total Guests</span>
            <span className={`${styles.icon} ${styles.iconUser}`}>👥</span>
          </div>
          <div className={styles.cardValue}>{stats.totalUsers}</div>
          <div className={styles.cardSub}>Registered accounts</div>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Revenue Trends (6 Months)</h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`} 
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#c5a059" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}