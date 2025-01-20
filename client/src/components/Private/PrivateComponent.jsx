import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

const PrivateComponent = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!authToken || !refreshToken) {
          console.log("No tokens found. User is not logged in.");
          setAuth(false);
          setLoading(false);
          return;
        }

        const apiUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_API}/auth/checklogin`;

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "x-refresh-token": refreshToken,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const response = await res.json();

        if (response.newAuthToken || response.newRefreshToken) {
          localStorage.setItem("authToken", response.newAuthToken || authToken);
          localStorage.setItem("refreshToken", response.newRefreshToken || refreshToken);
        }

        if (response.ok) {
          setAuth(true);
        } else {
          setAuth(false);
          throw new Error(response.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Error details:", error.message);

        // Clear tokens if login fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        toast.error("You need to log in first!", { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while authentication is being verified
  }

  return auth ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default PrivateComponent;
