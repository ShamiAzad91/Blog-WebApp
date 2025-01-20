import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ _id, title, imageUrl }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div
      className='blogcard'
      onClick={() => navigate(`/pages/blogpage?blogid=${_id}`)} // Use navigate for navigation
    >
      <div
        className='blogimg'
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      <p>{title}</p>
    </div>
  );
};

export default BlogCard;
