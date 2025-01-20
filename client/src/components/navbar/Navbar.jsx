import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { BiSearchAlt,BiPlus,BiSolidUserCircle } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../asset/logo.png";
import {toast} from "react-toastify";

const Navbar = () => {
const [auth,setAuth] = useState(false);
const navigate = useNavigate();

useEffect(()=>{
  checkLogin();

},[])

const checkLogin = async () => {
  try {
      const authToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!authToken || !refreshToken) {
        console.log("No tokens found. User is not logged in.");
        setAuth(false);
        return; // Exit the function without throwing an error
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
      navigate("/auth/signin");
  }
};

const handleLogout = () => {
  // Log action
  console.log("User is logging out");

  // Clear authentication tokens
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");

  // Update auth state (if applicable)
  setAuth(false);

  // Show feedback to the user
  toast.success("Logged out successfully!", { position: "top-right", autoClose: 2000 });

  // Navigate to the signup or login page
  // navigate("/auth/signin");
  window.location.href("/auth/signin");

};


  return (
    <>
    <nav className='navbar'>
        <div className="navbar-left">
          <Link to="/profile">
            <BiSolidUserCircle className='icon' />
          </Link>
          <Link to="/addblog">
            <BiPlus className='icon' />
          </Link>
          <Link to="/search">
            <BiSearchAlt className='icon' />
          </Link>
            
        </div>
        <div className="navbar-middle">
          <Link to="/">
          <img src={logo} className='logo' alt='pic of the company' style={{width:'70px',height:'30px',objectFit:'cover'}}/>
          </Link>
        </div>
        {
          auth ? (   <>
            <div className="navbar-right">
           <Link to="/">Home</Link>
           <Link to="/about">ABout</Link>
           <Link to="/contact">Contact</Link>
           <Link onClick={handleLogout}>Logout</Link>
           
         </div>
           </>) :( <>
         <div className="navbar-right">
          <Link to="/auth/signin">Login</Link>
          <Link to="/auth/signup">Signup</Link>

        </div>
        </>)
        }
        
        
      


    </nav>
    </>
  )
}

export default Navbar
// https://github.com/virajj014/Blog3xFrontend