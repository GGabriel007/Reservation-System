import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Home Component
 * Serves as the landing page and performs an initial connectivity check
 * with the backend API to ensure the service is reachable.
 */
export default function Home() {
  const [serverStatus, setServerStatus] = useState<string>("Checking connection...");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Environment-based API selection
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050";

  /**
   * Backend Health Check
   * Pings the root endpoint of the API to verify server availability.
   */
  useEffect(() => {
    fetch(baseUrl, {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((data) => {
        setServerStatus(data);
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Connectivity check failed:", error);
        setServerStatus("Server is currently unreachable.");
        setIsConnected(false);
      });
  }, [baseUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Hero Section */}
      <header className="max-w-2xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Home Page
        </h1>
    
      </header>

      {/* Call to Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link
          to="/signup"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Log In
        </Link>
      </div>

      {/* Backend Status Badge (Helpful for Developers & Users) */}
      <footer className="mt-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
          <span 
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected === true ? "bg-green-500 animate-pulse" : 
              isConnected === false ? "bg-red-500" : "bg-yellow-500"
            }`}
          ></span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            The backend says :D <span className="text-gray-700">{serverStatus}</span>
          </span>
        </div>
      </footer>
    </div>
  );
}