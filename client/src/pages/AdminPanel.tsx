import { useState, useEffect } from "react";

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
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/users`, {
          method: "GET",
          credentials: "include", // Required to send your session cookie
        });

        if (!response.ok) throw new Error("Failed to fetch users. Are you logged in?");

        const data = await response.json();
        // Adjust this if your backend returns { users: [...] } instead of just [...]
        setUsers(Array.isArray(data) ? data : data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  if (loading) return <div className="p-8 text-center">Loading Database Data...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Registered Users ({users.length})</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm uppercase text-gray-600">
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b">Method</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b text-xs text-gray-400">{user._id}</td>
                <td className="p-4 border-b font-medium">{user.email}</td>
                <td className="p-4 border-b capitalize">{user.role}</td>
                <td className="p-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${user.loginMethod === 'google' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {user.loginMethod}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}