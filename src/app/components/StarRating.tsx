import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; 

type StarRatingProps = {
  rating: number; // Rating out of 5
};

function StarRating({rating}: StarRatingProps) {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating - fullStars >= 0.5; // Check if there's a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Number of empty stars

  return (
    <div className="flex items-center text-base">
      {[...Array(fullStars)].map((_, index) => (
          <FaStar key={index} className="text-yellow-500 text-xl halfxl:text-lg" />
      ))}

      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500 text-xl halfxl:text-lg" />}

      {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={index} className="text-yellow-500 text-xl halfxl:text-lg" />
      ))}
    </div>
  )
}

export default StarRating