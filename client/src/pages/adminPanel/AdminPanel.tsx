import { useState, useEffect } from "react";
import styles from "./styles.module.css";

interface User {
  _id: string;
  email: string;
  role: string;
  loginMethod: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseUrl = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://liore.us-east-1.elasticbeanstalk.com";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/users`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized Access");

        const data = await response.json();
        console.log(data);
        setUsers(Array.isArray(data) ? data : data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  if (loading)
    return <div className={styles.adminPanelPage}>Loading secure data...</div>;
  if (error) return <div className={styles.adminPanelPage}>Error: {error}</div>;

  return (
    <main className={styles.adminPanelPage}>
      <header className={styles.headerArea}>
        <h1>Lioré Administration</h1>
        <p className={styles.statsText}>
          Managing {users.length} registered users
        </p>
      </header>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <span>User Management Database</span>
          {/* You could add a "Download CSV" or "Add User" button here later */}
        </div>

        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Internal ID</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Auth Method</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={styles.userRow}>
                <td className={styles.idCell}>{user._id.slice(-6)}...</td>
                <td style={{ fontWeight: 500 }}>{user.email}</td>
                <td>
                  <span
                    className={`${styles.roleBadge} ${
                      user.role === "admin"
                        ? styles.roleAdmin
                        : styles.roleGuest
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className={styles.methodBadge}>
                    <span
                      className={`${styles.dot} ${
                        user.loginMethod === "google"
                          ? styles.googleDot
                          : styles.localDot
                      }`}
                    ></span>
                    {user.loginMethod}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
