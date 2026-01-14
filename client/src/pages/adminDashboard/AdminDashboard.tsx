import { useState } from "react";
import styles from "./styles.module.css";
import HotelManager from "../../components/modals/hotelManager/HotelManager";

// --- PLACEHOLDER COMPONENTS (Keep these until you build them) ---
const DashboardStats = () => (
  <div className="p-6 text-center text-gray-500">
    <h3 className="text-lg font-bold">Global Analytics</h3>
    <p>Charts for Room Utilization & Revenue will go here.</p>
  </div>
);

const UserManager = () => (
  <div className="p-6 text-center text-gray-500">
    <h3 className="text-lg font-bold">User & Role Management</h3>
    <p>Searchable table to promote Guests to Managers goes here.</p>
  </div>
);

const TransactionLog = () => (
  <div className="p-6 text-center text-gray-500">
    <h3 className="text-lg font-bold">Financial Audit</h3>
    <p>Stripe transaction history table goes here.</p>
  </div>
);
// ---------------------------------------------------------------------

/**
 * Admin Dashboard Page
 * A centralized "Command Center" for Global Administrators.
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "hotels" | "users" | "finance">("overview");

  return (
    <main className={styles.mainPage}>
      <div className={styles.dashboardContainer}>
        
        {/* HEADER SECTION */}
        <header className={styles.header}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Command Center</h1>
            <p className="text-gray-500 mt-1">
              Manage properties, staff, and financial health from one place.
            </p>
          </div>
          <div className={styles.adminBadge}>
            Global Admin
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className={styles.tabs}>
          <button 
            onClick={() => setActiveTab("overview")}
            className={`${styles.tabButton} ${activeTab === "overview" ? styles.active : ""}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("hotels")}
            className={`${styles.tabButton} ${activeTab === "hotels" ? styles.active : ""}`}
          >
            Properties
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`${styles.tabButton} ${activeTab === "users" ? styles.active : ""}`}
          >
            Users & Roles
          </button>
          <button 
            onClick={() => setActiveTab("finance")}
            className={`${styles.tabButton} ${activeTab === "finance" ? styles.active : ""}`}
          >
            Financials
          </button>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <section className={styles.contentArea}>
          {activeTab === "overview" && <DashboardStats />}
          
          {/* This now renders your REAL component from the other file */}
          {activeTab === "hotels" && <HotelManager />}
          
          {activeTab === "users" && <UserManager />}
          {activeTab === "finance" && <TransactionLog />}
        </section>

      </div>
    </main>
  );
}