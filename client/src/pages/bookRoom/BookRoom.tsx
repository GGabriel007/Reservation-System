import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import UserList from "@/redux/features/api/UserList";

interface User {
  _id: string;
  email: string;
  role: string;
  loginMethod: string;
}

/**

 * Booking Room and Update Preference Page Component
 * use to update room booking or user preference, also use for adding addition rooms
 */

export default function BookRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${"http://localhost:8080"}/admin/users`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized Access");

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    console.log(users);
    console.log(error);
    console.log(loading);
  }, []);
  return (
    <main className={styles.mainPage}>
      <div className="inner-grid">
        <div className="layout-grid">
          <UserList></UserList>
        </div>
      </div>
    </main>
  );
}
