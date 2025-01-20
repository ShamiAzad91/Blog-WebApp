import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import CategoryCard from './CategoryCard';

const CategoriesSlider = () => {
  const [categories,setCategories] = useState([]);
  const [loading,setLoading] = useState(false)


  // Function to fetch categories
  const getCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/blogcategories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      const categories = data.categories || [];

      const tempCat = categories.map((category) => ({
        name: category,
        path: category,
        bgcolor: 'black', // You can replace with dynamic color generation if needed
      }));

      // Set the categories state
      setCategories(tempCat);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories, please try again later.');
    } finally {
      setLoading(false); // Set loading state to false once the fetch is complete
    }
  };

  useEffect(()=>{
getCategories();
  },[])


    // const categories = [
    //     {
    //         name:'Category 1',
    //         path:'#',
    //         bgcolor:generate()
    //     },
    //     {
    //         name:'Category 2',
    //         path:'#',
    //         bgcolor:generate()
    //     },
    //     {
    //         name:'Category 3',
    //         path:'#',
    //         bgcolor:generate()
    //     },
    //     {
    //         name:'Category 4',
    //         path:'#',
    //         bgcolor:generate()
    //     },
    //     {
    //         name:'Category 5',
    //         path:'#',
    //         bgcolor:generate()
    //     },

    //     {
    //         name:'Category 6',
    //         path:'#',
    //         bgcolor:generate()
    //     },
    //     {
    //         name:'Category 7',
    //         path:'#',
    //         bgcolor:generate()
    //     }
    // ]


    // function createHex() {
    //     var hexCode1 = "";
    //     var hexValues1 = "0123456789abcdef";
    
    //     for (var i = 0; i < 6; i++) {
    //       hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
    //     }
    //     return hexCode1;
    //   }
    
    //   function generate() {
    
    //     var deg = Math.floor(Math.random() * 360);
    
    //     var gradient = "linear-gradient(" + deg + "deg, " + "#" + createHex() + ", " + "#" + createHex() + ")";
    //     console.log(gradient);
    //     return gradient;
    //   }


  return (
    <div className='sliderout'>
      <h1 style={{fontWeight:'400',fontSize:'20px',margin:'10px 5px'}}>Categories</h1>
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
        {categories.map((category,index)=>{
            return (
                <SwiperSlide key={index+1}>
                    <CategoryCard {...category} />
                </SwiperSlide>

            )
        })}
     
      </Swiper>
    </div>
  )
}

export default CategoriesSlider