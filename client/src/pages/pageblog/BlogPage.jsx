import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import Navbar from '../../components/navbar/Navbar';
import './BlogPage.css';
import ClockLoader from "react-spinners/ClockLoader";
import BlogsSlider from '../../components/blogscard/BlogsSlider';
import Footer from '../../components/footer/Footer';

const BlogPage = () => {
    const [searchParams] = useSearchParams(); // Get the search parameters
    const blogid = searchParams.get('blogid'); // Extract the value of 'blogid'
    const [loading, setLoading] = useState(false)
    //   console.log(blogid)

    const [blog, setBlog] = useState({
        _id: '',
        title: '',
        description: '',
        imageUrl: '',
        paragraphs: [],
        category: '',
        owner: '',
        createdAt: '',
        updatedAt: ''
    });
    const [blogcreatedat, setBlogcreatedat] = useState('');
    const getBlogbyId = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_API}/blog/single/${blogid}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        let data = await response.json(); // Parse JSON response
        setLoading(false);
    
        if (response.ok) {
          // console.log("hello",response.data.data);
          // console.log("oooo",data);
          // console.log("saaaa",data.data.blog);

         data = data.data

          if (data.blog) {
            // console.log("hii",data.blog)
            setBlog(data.blog); // Update the blog state
            const formattedDate = formatDate(data.blog.createdAt); // Format the creation date
            setBlogcreatedat(formattedDate);
          } else {
            toast('Blog data is not available!', { type: 'error' });
          }
        } else {
          toast(data.message || 'Failed to fetch blog!', { type: 'error' });
        }
      } catch (error) {
        
        setLoading(false);
        toast(error.message || 'An error occurred!', { type: 'error' });
      }
    };
    
  
  useEffect(() => {
      getBlogbyId();
      window.scrollTo(0, 0);
  }, []);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
}
  
  
return (
  <div className='blogpage-out'>
      <Navbar />

      {
          loading && blog._id == '' ?
              <div className='loaderfullpage'>
                  <ClockLoader
                      color="#36d7b7"
                      loading={loading}
                      size={150}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                  />
              </div>
              :
              <div className='blogpage'>
                  <div className='c1'>
                      <p className='createdat'>Created at {blogcreatedat}</p>
                      <p className='title'>{blog.title}</p>
                      <p className='category'>{blog.category}</p>

                     {
                      blog.imageUrl.length>0 && 
                      <img src={blog.imageUrl} alt={blog.title} width={100} height={100} className='blogimg'  />
                     }
                      <p className='description'>{blog.description}</p>
                  </div>
                  {
                      blog.paragraphs.map((paragraph, index) => (
                          <div className={
                              index % 2 === 0 ? 'c2left' : 'c2right'
                          } key={index}>
                              {
                                  paragraph.imageUrl.length > 0 &&
                                  <img src={paragraph.imageUrl} alt={blog.title} width={100} height={100}
                                      className='paraimg'  />
                              }
                              <div>
                                  <p className='title'>{paragraph.title}</p>
                                  <p className='description'>{paragraph.description}</p>
                              </div>
                          </div>
                      ))
                  }
                  <BlogsSlider />
              </div>
      }

      <Footer />
  </div>
)
}

export default BlogPage