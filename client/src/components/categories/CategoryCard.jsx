import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ name, bgcolor, path }) => {
  return (
    <div className='categorycard' style={{ backgroundColor: bgcolor }}>
      <p style={{ fontSize: '18px' }}>
        {name}
      </p>
    </div>
  );
};

export default CategoryCard;
