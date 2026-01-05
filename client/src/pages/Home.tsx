import { useEffect, useState, useRef } from "react";

/**
 * Home Page
 * @returns {TSX.Element} Homepage component
 */
export default function Home() {
  const [serverMessage, setServerMessage] = useState("Waiting for backend...");

  useEffect(() => {
    // Using EC2 instance URL
    const url = import.meta.env.DEV
      ? "http://localhost:5050"
      : "http://ec2-54-210-167-76.compute-1.amazonaws.com";
    fetch(url, {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((data) => setServerMessage(data))
      .catch((error) =>
        setServerMessage("Connection failed: " + error.message)
      );
  }, []);
  return (
    <>
      <h1>
        Backend is saying: <strong>{serverMessage}</strong>
      </h1>
    </>
  );
}
