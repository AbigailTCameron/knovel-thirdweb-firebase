import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; 

type StarRatingProps = {
  rating: number; // Rating out of 5
};

function StarRating({rating}: StarRatingProps) {
  // ✅ Ensure rating is always between 0 and 5
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

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