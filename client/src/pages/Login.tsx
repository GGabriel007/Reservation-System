import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

/**
 * Login Component
 * Provides two authentication paths: 
 * Local: Submits credentials via JSON Fetch request to establish a session.
 * Google OAuth: Redirects the browser to the Google authorization server.
 */
export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user was redirected here after a successful signup
  const signupSuccess = location.state?.signupSuccess;

  // Environment-based API selection
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com:5050/";

  /**
   * Local Login Handler
   * Sends email/password to the backend and expects a session cookie in return.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/local/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Required to receive and store the 'sid' session cookie
      });

      if (response.ok) {
        navigate("/user");
      } else {
        const errorData = await response.json().catch(() => ({ message: "Invalid credentials" }));
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login network error:", error);
      setErrorMessage("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-500 mt-2">Log in</p>
        </header>

        {/* Success message from Signup page redirect */}
        {signupSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-6 border border-green-100">
            Account created successfully! Please log in.
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
              ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"}`}
          >
            {isSubmitting ? "Logging in..." : "Login with Email"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          
        </div>

        <a
          href={`${baseUrl}/auth/google/login`}
          className="flex items-center justify-center w-full py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all gap-3"
        >
          Login with Google
        </a>

        <footer className="mt-8 text-center text-sm text-gray-600">
        
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </footer>
      </div>
    </div>
  );
}