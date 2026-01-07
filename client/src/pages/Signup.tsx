import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/**
 * Signup Page Component
 * Handles the registration of new local accounts.
 * On success, it redirects users to the Login page to establish their first session.
 */
export default function Signup() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Environment-based API selection
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050";

  /**
   * Registration Handler
   * Sends user credentials to the /auth/register endpoint.
   * Note: The backend expects 'username' but we collect an email address.
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login upon successful account creation
        navigate("/login", { state: { signupSuccess: true } });
      } else {
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup network error:", error);
      setErrorMessage(
        "Unable to reach the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-500 mt-2">
            Create your account to start booking.
          </p>
        </header>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all 
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-md"
              }`}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Log in here
          </Link>
        </footer>
      </div>
    </div>
  );
}
