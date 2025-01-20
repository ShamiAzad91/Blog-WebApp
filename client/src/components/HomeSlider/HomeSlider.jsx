import React, { useState, useEffect } from 'react';
import img1 from "../../asset/slider/slider1.png";
import img2 from "../../asset/slider/slider2.png";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import './styles.css';
// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const HomeSlider = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        style={{ height: `${windowDimensions.height / 2}px` }} // Set Swiper height to half of screen height
      >
        <SwiperSlide>
          <img 
            src={img1} 
            alt="" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </SwiperSlide>
        <SwiperSlide>
          <img 
            src={img2} 
            alt="" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSlider;