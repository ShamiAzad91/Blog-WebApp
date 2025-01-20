
import React, { useState } from 'react';
import Navbar from "../../../components/navbar/Navbar"
import { Link, useNavigate } from 'react-router-dom';
import '../auth.css';
import {toast} from "react-toastify";
import logo from "../../../asset/blogsam.png";

const Signup = () => {
  const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
  });
  const navigate  = useNavigate();

  const [errors,setErrors] = useState({});


  const handleChange=(e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value})

  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    // console.log(import.meta.env.VITE_REACT_APP_BACKEND_API);// for vite react app use import.meta.env   
 console.log(formData);
 const validationErrors = {};
 if (!formData.name.trim()) validationErrors.name = 'Name is required.';
 if (!formData.email.trim()) {
   validationErrors.email = 'Email is required.';
 } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
   validationErrors.email = 'Email is invalid.';
 }
 if (!formData.password) {
   validationErrors.password = 'Password is required.';
 } else if (formData.password.length < 5) {
   validationErrors.password = 'Password must be at least 5 characters.';
 }
 if (!formData.confirmPassword) {
   validationErrors.confirmPassword = 'Please confirm your password.';
 } else if (formData.password !== formData.confirmPassword) {
   validationErrors.confirmPassword = 'Passwords do not match.';
 }

 if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
return
}

fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/auth/register`, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
.then((res) => {
  return res.json();
})
.then((response) => {
  if (response.ok) {
      toast(response.message, {
          type: 'success',
          position: 'top-right',
          autoClose: 2000
      })
      setFormData(
          {
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
          }
      )
              // Redirect to sign-in page or home
              navigate('/auth/signin');
  } else {
      toast(response.message, {
          type: 'error',
          position: 'top-right',
          autoClose: 2000
      });
  }
})
.catch((error) => {
  toast(error.message, {
      type: 'error',
      position: 'top-right',
      autoClose: 2000
  });
})
 

  }

  
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
              <label>Name</label>
              <input type="text" placeholder='enter your name' name='name' value={formData.name} onChange={handleChange} />
              {errors.name && <span className='formerror'>{errors.name}</span>}
            </div>
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
            <div className="forminput_cont">
              <label>confirm password</label>
              <input type="text" placeholder='confirm your password'name='confirmPassword'  value={formData.confirmPassword} onChange={handleChange}/>
              {errors.confirmPassword && <span className='formerror'>{errors.confirmPassword}</span>}
           
            </div>
            <button type='submit' className='main_button'>Register</button>
            <p className='authlink'>Already have an account ? <Link to="/auth/signin">Login</Link></p>
          </form>
      </div>

    </div>
    </div>
  )
}

export default Signup