import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import AddBlog from "./pages/addBlog/AddBlog";
import Home from "./home/Home";
import Signup from "./pages/auth/signup/Signup";
import Signin from "./pages/auth/signin/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import PrivateComponent from "./components/Private/PrivateComponent";
import BlogPage from "./pages/pageblog/BlogPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route element={<PrivateComponent />}>
            <Route path="/about" element={<About />} />
            <Route path="/addblog" element={<AddBlog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/pages/blogpage?blogid=${_id}" element={<BlogPage />} /> */}
            <Route path="/pages/blogpage" element={<BlogPage />} />

          </Route>

          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/signin" element={<Signin />} />

          {/* Route for incorrect paths */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
        {/* ToastContainer must be here for global toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </>
  );
}

export default App;
