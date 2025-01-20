import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import profilePic from "../../asset/Images/profile.png";
import { toast } from "react-toastify";
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null); // State for user profile
  const [loading, setLoading] = useState(true); // State for loading
 
 

  // Fetch user details
  const getUserDetails = async () => {
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!authToken || !refreshToken) {
      window.location.href = "/auth/signin"; 
      return; // Do not redirect if no tokens are found
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_API}/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );
  
      const data = await response.json();
      console.log("Full API Response:", data); // Log the entire response object
      console.log("User Details:", data.userDetails); 
      
      
      setLoading(false);

      if (response) {
        setProfile(data.userDetails); // Update profile state with user details
      } else {
        toast(data.message || "Failed to fetch user profile!", { type: "error" });
      }
    } catch (error) {
      console.log("hello",error);
      
      setLoading(false);
      toast(error.message || "An error occurred!", { type: "error" });
    }
  };

  useEffect(() => {
    getUserDetails();

  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!profile) {
    return <div>No profile data available!</div>; // Fallback for no profile
  }

  return (
    <>
      <Navbar />
      <div className="card-body">
        <div className="profile-card">
          <img src={profilePic} alt="Avatar" />
          <h2>{profile.name || "guest name"}</h2>
          <p>Email: {profile.email || "Guest email"}</p>
          <p>Password: ********</p>
          <button>Update Profile</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
