import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ActionStatusModal from "@/components/global/toast/actionsStatusModal/ActionStatusModal";
import ConfirmDeleteToast from "@/components/global/toast/confirmationDeleteToast/ConfirmationDeleteToast";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "guest" | "manager" | "admin";
  createdAt?: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
  };

  const executeRoleUpdate = async (userId: string) => {
    const newRole = pendingChanges[userId];
    if (!newRole) return;

    try {
      const res = await fetch(`${baseUrl}/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as any } : u));
        
        const remainingChanges = { ...pendingChanges };
        delete remainingChanges[userId];
        setPendingChanges(remainingChanges);

        setModalConfig({ isOpen: true, message: "User role updated successfully!", type: 'success' });
      } else {
        setModalConfig({ isOpen: true, message: "Failed to update role.", type: 'error' });
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
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>User Management</h2>
          <p className={styles.subtitle}>Promote staff and manage access levels.</p>
        </div>
        <div className={styles.userCount}>
          Total Users: {users.length}
        </div>
      </div>

      {/* Filter Pills */}
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
                const hasPendingChange = pendingRole && pendingRole !== user.role;

                return (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.firstName || "User"} {user.lastName || ""}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{getJoinDate(user)}</td>
                    <td className={styles.roleCell}>
                      <div className={styles.roleWrapper}>
                        <select
                          value={currentRole}
                          onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                          className={`${styles.roleSelect} ${hasPendingChange ? styles.roleChanged : ''}`}
                        >
                          <option value="guest">Guest</option>
                          <option value="manager">Hotel Manager</option>
                          <option value="admin">Global Admin</option>
                        </select>

                        {/* Save Button (Only shows if role changed) */}
                        {hasPendingChange && (
                          <button 
                            onClick={() => executeRoleUpdate(user._id)}
                            className={styles.saveBtn}
                            title="Confirm Role Change"
                          >
                            Save
                          </button>
                        )}

                        {/* Delete Button (Only shows if NO change pending) */}
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