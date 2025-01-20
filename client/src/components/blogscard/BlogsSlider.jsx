import React, { useState,useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import BlogCard from './BlogCard';

const BlogsSlider = () => {
  const [blogs,setBlogs] = useState([]);

    // const blogs = [
    //     {
    //         name:'Blog 1',
    //         path:'#',
    //         bgcolor:"black"
    //     },
    //     {
    //         name:'Blog 2',
    //         path:'#',
    //         bgcolor:"black"
    //     },
    //     {
    //         name:'Blog 3',
    //         path:'#',
    //         bgcolor:"black"
    //     },
    //     {
    //         name:'Blog 4',
    //         path:'#',
    //         bgcolor:"black"
    //     },
    //     {
    //         name:'Blog 5',
    //         path:'#',
    //         bgcolor:"black"
    //     },

    //     {
    //         name:'Blog 6',
    //         path:'#',
    //         bgcolor:"black"
    //     },
    //     {
    //         name:'Blog 7',
    //         path:'#',
    //         bgcolor:"black"
    //     }
    // ]
    const get10latestblogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/blog`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json(); // Parse the JSON response
    
        if (response.ok) {
          console.log(data); 
          setBlogs(data.data.blogs); // Assuming the response contains 'data' with 'blogs'
        } else {
          toast(data.message, {
            type: 'error',
          });
        }
      } catch (error) {
        toast(error.message, {
          type: 'error',
        });
      }
    };
    
  
    useEffect(() => {
      get10latestblogs(); // Fetch the latest 10 blogs on component mount
    }, []);
  

    
  return (
    <div className='sliderout'>
      <h1 style={{fontWeight:'400',fontSize:'20px',margin:'10px 5px'}}>Latest Blogs</h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          '@1.50': {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {blogs.map((blog,index)=>{
            return (
                <SwiperSlide key={blog._id}>
                    <BlogCard {...blog}/>
                </SwiperSlide>

            )
        })}
     
      </Swiper>
    </div>
  )
}

export default BlogsSlider