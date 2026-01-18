import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";

interface Hotel {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "guest" | "manager" | "admin";
  assignedHotel?: string | Hotel;
  createdAt?: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // Store the list of available hotels
  const [hotels, setHotels] = useState<Hotel[]>([]);
  // Track hotel selection: { userId: hotelId }
  const [pendingHotels, setPendingHotels] = useState<{ [key: string]: string }>({});

  const fetchHotels = async () => {
    try {
      const res = await fetch(`${baseUrl}/hotels`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Error loading hotels:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHotels();
  }, []);


  // --- FILTER & STATE MANAGEMENT ---
  const [filterTab, setFilterTab] = useState<"all" | "admin" | "manager" | "guest">("all");
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: string }>({});

  // Track which user is being deleted (triggers the modal)
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
    type: 'success' as 'success' | 'error'
  });

  const baseUrl = import.meta.env.PROD
    ? "http://liore.us-east-1.elasticbeanstalk.com"
    : "http://localhost:8080";

  // --- HELPER: Extract Date ---
  const getJoinDate = (user: User) => {
    if (user.createdAt) {
      return new Date(user.createdAt).toLocaleDateString();
    }
    try {
      const timestamp = parseInt(user._id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseUrl}/users`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- DELETE LOGIC ---
  const initiateDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`${baseUrl}/users/${userToDelete}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user._id !== userToDelete));

        // Clear pending changes for this user
        setPendingChanges(prev => {
          const copy = { ...prev };
          delete copy[userToDelete];
          return copy;
        });

        setModalConfig({ isOpen: true, message: "User deleted successfully", type: 'success' });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setModalConfig({ isOpen: true, message: "Failed to delete user.", type: 'error' });
    } finally {
      setUserToDelete(null);
    }
  };

  // --- ROLE UPDATE LOGIC ---
  const handleRoleSelect = (userId: string, newRole: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [userId]: newRole
    }));

    // If switching AWAY from manager, clear any pending hotel selection
    if (newRole !== "manager") {
      setPendingHotels(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    }
  };

  // 7. Add a new function to handle hotel selection
  const handleHotelSelect = (userId: string, hotelId: string) => {
    setPendingHotels(prev => ({
      ...prev,
      [userId]: hotelId
    }));
  };

  const executeRoleUpdate = async (userId: string) => {
    // 1. Get the user object to access current values
    const currentUser = users.find(u => u._id === userId);
    if (!currentUser) return;

    // 2. FIX: Use pending role if it exists, otherwise fallback to existing role
    const newRole = pendingChanges[userId] || currentUser.role;

    // 3. FIX: Use pending hotel if it exists, otherwise fallback to existing hotel ID
    // We check if assignedHotel is an object (populated) or string to get the ID safely
    const existingHotelId = typeof currentUser.assignedHotel === 'object'
      ? currentUser.assignedHotel?._id
      : currentUser.assignedHotel;

    const newHotel = pendingHotels[userId] || existingHotelId;

    // Validation: Prevent saving a manager without a hotel
    if (newRole === 'manager' && !newHotel) {
      setModalConfig({ isOpen: true, message: "Please select a hotel for the manager.", type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // Send the effective Role and Hotel (whether changed or not)
        body: JSON.stringify({ role: newRole, assignedHotel: newHotel })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => {
          if (u._id === userId) {
            return {
              ...u,
              role: newRole as any,
              // Update local state with the new hotel object (found from the hotels list)
              assignedHotel: hotels.find(h => h._id === newHotel)
            };
          }
          return u;
        }));

        // Clear pending changes
        const remainingChanges = { ...pendingChanges };
        delete remainingChanges[userId];
        setPendingChanges(remainingChanges);

        const remainingHotels = { ...pendingHotels };
        delete remainingHotels[userId];
        setPendingHotels(remainingHotels);

        setModalConfig({ isOpen: true, message: "User updated successfully!", type: 'success' });
      } else {
        setModalConfig({ isOpen: true, message: "Failed to update user.", type: 'error' });
      }
    } catch (error) {
      setModalConfig({ isOpen: true, message: "Network error.", type: 'error' });
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => {
    if (filterTab === "all") return true;
    return user.role === filterTab;
  });

  if (loading) return <div className={styles.loading}>Loading Users...</div>;

  return (
    <div className={styles.container}>
      {/* Header and Filter Pills remain exactly the same... */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>User Management</h2>
          <p className={styles.subtitle}>Promote staff and manage access levels.</p>
        </div>
        <div className={styles.userCount}>
          Total Users: {users.length}
        </div>
      </div>

      <div className={styles.filterTabs}>
        {['all', 'admin', 'manager', 'guest'].map((tab) => (
          <button
            key={tab}
            className={`${styles.filterBtn} ${filterTab === tab ? styles.activeFilter : ''}`}
            onClick={() => setFilterTab(tab as any)}
          >
            {tab === 'all' ? 'All Users' : tab === 'manager' ? 'Managers' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Role Assignment</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className={styles.emptyState}>No users found in this category.</td></tr>
            ) : (
              filteredUsers.map((user) => {
                const pendingRole = pendingChanges[user._id];
                const currentRole = pendingRole || user.role;

                // 1. Check if the user is currently being set to Manager
                const isManager = currentRole === 'manager';

                // 2. Determine the current Hotel Value (Existing OR Pending)
                // We handle cases where assignedHotel is a string ID or a populated Object
                const existingHotelId = typeof user.assignedHotel === 'object'
                  ? user.assignedHotel?._id
                  : user.assignedHotel;

                const currentHotelValue = pendingHotels[user._id] || existingHotelId || "";

                const hasPendingChange =
                  (pendingRole && pendingRole !== user.role) ||
                  (pendingHotels[user._id] && pendingHotels[user._id] !== existingHotelId);

                return (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.firstName || "User"} {user.lastName || ""}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{getJoinDate(user)}</td>
                    <td className={styles.roleCell}>
                      <div className={styles.roleWrapper}>

                        {/* ROLE SELECTOR */}
                        <select
                          value={currentRole}
                          onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                          className={`${styles.roleSelect} ${hasPendingChange ? styles.roleChanged : ''}`}
                        >
                          <option value="guest">Guest</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* HOTEL SELECTOR (Conditional: Only shows for Managers) */}
                        {isManager && (
                          <select
                            value={currentHotelValue}
                            onChange={(e) => handleHotelSelect(user._id, e.target.value)}
                            className={styles.roleSelect}
                            style={{ marginLeft: '10px', minWidth: '200px', backgroundColor: '#fff', color: '#333' }}
                          >
                            <option value="" disabled>Select Hotel</option>
                            {hotels.map(hotel => (
                              <option key={hotel._id} value={hotel._id}>
                                {hotel.name}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Save Button */}
                        {hasPendingChange && (
                          <button
                            onClick={() => executeRoleUpdate(user._id)}
                            className={styles.saveBtn}
                            title="Confirm Role Change"
                            // Disable save if they are a manager but haven't picked a hotel yet
                            disabled={isManager && !currentHotelValue}
                            style={isManager && !currentHotelValue ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            Save
                          </button>
                        )}

                        {/* Delete Button */}
                        {!hasPendingChange && (
                          <button
                            onClick={() => initiateDelete(user._id)}
                            className={styles.deleteBtn}
                            title="Delete User"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <ConfirmDeleteToast
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="Delete User Account?"
        message="This will permanently remove the user and their access permissions. This action cannot be undone."
      />

      <ActionStatusModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}