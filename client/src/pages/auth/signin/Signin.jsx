import React, { useState,useEffect } from 'react';
import Navbar from "../../../components/navbar/Navbar"
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';
import {toast} from "react-toastify";
import logo from "../../../asset/blogsam.png";

const Signin = () => {
 const [formData,setFormData] = useState({
    email:'',
    password:''
  });
  const navigate  = useNavigate();
 const [errors,setErrors] = useState({});
  

 useEffect(() => {
  const authToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (authToken && refreshToken) {
    checkLogin();
  }
}, []);
  const handleChange=(e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value})

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Invalid email address.';
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    } else if (formData.password.length < 5) {
      validationErrors.password = 'Password must be at least 5 characters.';
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const authToken = res.headers.get('Authorization')?.split(' ')[1];
      const refreshToken = res.headers.get('x-refresh-token');
      const response = await res.json();
  
      if (response.ok) {
        toast.success(response.message, { autoClose: 2000 });
  
        setFormData({ email: '', password: '' });
  
        if (authToken) localStorage.setItem('authToken', authToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  
        // Redirect directly instead of calling checkLogin
        navigate("/"); // Redirect to the dashboard
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!', { autoClose: 3000 });
    }
  };
  


  const checkLogin = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (!authToken || !refreshToken) {
        return; // Do not redirect if no tokens are found
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
        throw new Error("Session expired or invalid tokens.");
      }
  
      const response = await res.json();
  
      // Refresh tokens if provided
      if (response.newAuthToken) localStorage.setItem("authToken", response.newAuthToken);
      if (response.newRefreshToken) localStorage.setItem("refreshToken", response.newRefreshToken);
  
      if (response.ok) {
        navigate("/"); // Redirect to the dashboard
      }
    } catch (error) {
      console.warn("Error in checkLogin:", error.message);
      // Clear tokens and allow access to Signin
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
    }
  };
  

    



  return (
    <div className='authout'>
    <Navbar />
    <div className='authin'>
      <div className="left">
      <img src={logo} alt="logosignup" className='img' />

      </div>
      <div className="right">
          <form onSubmit={handleSubmit}>
           
            <div className="forminput_cont">
              <label>email</label>
              <input type="email" placeholder='enter your email' name='email' value={formData.email} onChange={handleChange}/>
              {errors.email && <span className='formerror'>{errors.email}</span>}
            </div>
            <div className="forminput_cont">
              <label>password</label>
              <input type="password" placeholder='enter your password' name='password' value={formData.password} onChange={handleChange}/>
              {errors.password && <span className='formerror'>{errors.password}</span>}
            </div>
            
            <button type='submit' className='main_button'>Login</button>
            <p className='authlink'>Donot have an account ? <Link to="/auth/signup">Register</Link></p>
          </form>
      </div>

    </div>
    </div>
  )
}

export default Signin