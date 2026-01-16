import { useState } from "react";
import styles from "./styles.module.css";
import HotelManager from "../../components/modals/hotelManager/HotelManager";
import UserManager from "../../components/modals/userManager/UserManager";
import TransactionManager from "../../components/modals/transactionManager/TransactionManager";
import Overview from "../../components/modals/overview/Overview";
import ReservationManager from "../../components/modals/reservationManager/ReservationManager";
import { useAppSelector } from "@/redux/store";
import { selectUserInfo } from "@/redux/features/user/userSlice";

/**
 * Admin Dashboard Page
 * A centralized "Command Center" for Global Administrators.
 */
export default function AdminDashboard() {
  // 1. Added "reservations" to the allowed state values
  const [activeTab, setActiveTab] = useState<
    "overview" | "hotels" | "users" | "reservations" | "finance"
  >("overview");

  const userInfo = useAppSelector(selectUserInfo);

  return (
    <main className={styles.mainPage}>
      <div className={styles.dashboardContainer}>
        {/* HEADER SECTION */}
        <header className={styles.header}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Global Command Center
            </h1>

            {/* This is the new part that matches your AdminPanel style */}
            <p className="mt-2 text-gray-600">
              Operating as:{" "}
              <strong className="text-gray-900">
                {userInfo?.firstName} {userInfo?.lastName}
              </strong>
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Manage properties, staff, and financial health from one place.
            </p>
          </div>
        </header>
        {/* TAB NAVIGATION */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`${styles.tabButton} ${
              activeTab === "overview" ? styles.active : ""
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("hotels")}
            className={`${styles.tabButton} ${
              activeTab === "hotels" ? styles.active : ""
            }`}
          >
            Properties
          </button>

          {/* 2. Added the Reservations Tab Button */}
          <button
            onClick={() => setActiveTab("reservations")}
            className={`${styles.tabButton} ${
              activeTab === "reservations" ? styles.active : ""
            }`}
          >
            Reservations
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`${styles.tabButton} ${
              activeTab === "users" ? styles.active : ""
            }`}
          >
            Users & Roles
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`${styles.tabButton} ${
              activeTab === "finance" ? styles.active : ""
            }`}
          >
            Financials
          </button>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <section className={styles.contentArea}>
          {activeTab === "overview" && <Overview />}
          {activeTab === "hotels" && <HotelManager />}
          {/* 3. Added the Render Logic */}
          {activeTab === "reservations" && <ReservationManager />}
          {activeTab === "users" && <UserManager />}
          {activeTab === "finance" && <TransactionManager />}
        </section>
      </div>
    </main>
  );
}
