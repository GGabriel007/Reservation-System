import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Login Page
 * @returns {TSX.Element} Login component
 */
export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const url: string = import.meta.env.DEV
    ? "http://localhost:5050"
    : "http://ec2-54-210-167-76.compute-1.amazonaws.com";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Encode credentials to Base64 for Basic Auth
    const credentials = btoa(`${username}:${password}`);

    await fetch("http://localhost:5050/auth/local/login", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const cookie = data.cookie;
        const cookieString: string = `sid=${data.sessionId}; path=${cookie.path}; secure=${cookie.secure}; expires=${cookie.expires}`;
        document.cookie = cookieString;
        navigate("/user");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          email
          <input
            type="text"
            id="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          password
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login with local</button>
      </form>

      <a
        href="http://localhost:5050/auth/google/login"
        className="btn-google-login"
      >
        Login with google
      </a>
    </>
  );
}
