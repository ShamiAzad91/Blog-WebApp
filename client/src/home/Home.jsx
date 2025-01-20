import React from "react";
import Navbar from "../components/navbar/Navbar";
import HomeSlider from "../components/HomeSlider/HomeSlider";
import CategoriesSlider from "../components/categories/CategoriesSlider";
import BlogsSlider from "../components/blogscard/BlogsSlider";
import Footer from "../components/footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <HomeSlider />
      <CategoriesSlider />
      <BlogsSlider />
      <Footer/>
    </>
  );
};

export default Home;
