// export const UserReviews = ({ reviews }) => {
//   return (
//     <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
//       <h3 className="text-2xl font-semibold text-white mb-4">My Reviews</h3>
//       {reviews.length === 0 ? (
//         <p className="text-gray-400">You have not submitted any reviews yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {reviews.map((review) => (
//             <li key={review._id} className="border-b border-slate-700 pb-4 last:border-b-0">
//               <p className="font-semibold text-white"> Submitted By: {review.name}</p>
//               <p className="font-semibold text-white">Ratings: {review.rating} Stars</p>
//               <p className="font-semibold text-white">Review: {review.review}</p>
//               <p className="text-xs text-gray-500 mt-2">on {new Date(review.createdAt).toLocaleDateString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };




"use client";
import React from 'react';

// Star rating utility function (using inline SVG for consistency and styling)
const StarRating = ({ rating }: any) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const renderStar = (key: any, fill: any) => (
        <svg 
            key={key} 
            className={`w-4 h-4 ${fill}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
        >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.889 1.48 8.283L12 18.288l-7.416 3.888 1.48-8.283L.001 9.306l8.332-1.151L12 .587z"/>
        </svg>
    );

    const stars = [];
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(renderStar(`full-${i}`, 'text-yellow-400'));
    }
    // Half star
    if (hasHalfStar) {
        stars.push(
            <svg 
                key="half" 
                className="w-4 h-4 text-yellow-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <defs>
                    <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" style={{stopColor: 'currentColor', stopOpacity: 1}} />
                        <stop offset="50%" style={{stopColor: '#475569', stopOpacity: 1}} /> 
                    </linearGradient>
                </defs>
                <path 
                    d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.889 1.48 8.283L12 18.288l-7.416 3.888 1.48-8.283L.001 9.306l8.332-1.151L12 .587z"
                    style={{ fill: 'url(#half-gradient)' }}
                />
            </svg>
        );
    }
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars.push(renderStar(`empty-${i}`, 'text-slate-600'));
    }

    return <div className="flex items-center space-x-0.5">{stars}</div>;
};

export const UserReviews = ({ reviews }:any) => {
  return (
    // Ensure width is set to full for better dashboard layout integration
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h3 className="font-semibold text-white mb-4 third-heading">My Reviews</h3>
      
      {reviews.length === 0 ? (
        <p className="text-gray-400">You have not submitted any reviews yet.</p>
      ) : (
        // --- Added Fixed Height (max-h-[400px]) and Vertical Scrolling (overflow-y-auto) ---
        <div className="max-h-100 overflow-y-auto pr-2">
          <ul className="space-y-4">
            {reviews.map((review:any) => (
              <li 
                key={review._id} 
                className="border-b border-slate-700 pb-4 last:border-b-0 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-lg">
                      Review by: {review.name}
                    </p>
                    <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-yellow-400 font-medium">({review.rating})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-base mt-2">{review.review}</p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
