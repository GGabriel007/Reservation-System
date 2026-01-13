import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setUser } from "@/redux/features/user/userSlice";

const AuthPersist = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // --- DYNAMIC URL LOGIC ---
  const API_URL = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com" 
    : "http://localhost:8080";
  // -------------------------

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/need`, {
          method: "GET",
          credentials: "include", 
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      } catch (err) {
        console.log("Session restore failed.");
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [dispatch]);

  if (isLoading) {
    return (
       <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h3>Loading System...</h3>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthPersist;