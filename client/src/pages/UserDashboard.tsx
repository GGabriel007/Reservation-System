import { useEffect, useState } from "react";

/**
 * Dashboard Page
 * @returns {TSX.Element} User Dashboard Page component
 */
export default function UserDashboard() {
  useEffect(() => {
    // Using EC2 instance URL
    const url = import.meta.env.DEV
      ? "http://localhost:5050/auth/need"
      : "http://ec2-54-210-167-76.compute-1.amazonaws.com";
    fetch(url, {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((data) => data)
      .catch((error) => error);
  }, []);

  return (
    <>
      <h1>User Dashboard</h1>
    </>
  );
}
