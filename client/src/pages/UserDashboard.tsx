import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * User Interface
 * Matches the structure of the User document returned by the backend.
 * We use _id to align with MongoDB's unique identifier.
 */
interface User {
  _id: string;
  email: string;
  role?: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Environment-based API selection
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050";

  /**
   * Identity Check
   * Runs on component mount to verify if the user has an active session.
   * If the backend returns 401 (Unauthorized), the user is kicked to the login page.
   */
  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates if component unmounts

    const checkSession = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/need`, {
          credentials: "include",
        });

        if (res.status === 401) {
          if (isMounted) navigate("/login");
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) navigate("/login");
      }
    };

    checkSession();
    return () => { isMounted = false; };
  }, [navigate, baseUrl]);

  /**
   * Session Termination
   * Communicates with the backend to destroy the session and clear local user state.
   */
  const handleLogout = async () => {
    try {
      // FIX: Removed the starting slash from "/auth/logout" to prevent "//"
      await fetch(`${baseUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Prevent flashing of dashboard content before authentication check completes
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Overview</h1>
        <p className="text-gray-600">Profile settings.</p>
      </header>

      <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <div className="space-y-4">
          <section>
            <label className="block text-sm font-semibold text-gray-500 uppercase">Email Address</label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </section>

          <section>
            <label className="block text-sm font-semibold text-gray-500 uppercase">Database Identifier</label>
            <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded">{user?._id}</p>
          </section>

          <section>
            <label className="block text-sm font-semibold text-gray-500 uppercase">Account Role</label>
            <p className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-blue-700 bg-blue-100 rounded-full uppercase">
              {user?.role || "Guest"}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-md font-medium hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}