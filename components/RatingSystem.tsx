
import React, { useState } from 'react';
import { StarIcon } from './icons';

interface RatingSystemProps {
  label: string;
  rating: number;
  onRate: (value: number) => void;
  accentColor: string;
  disabled?: boolean;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ label, rating, onRate, accentColor, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const ratingGroupId = `rating-group-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="flex items-center justify-between">
      <span id={ratingGroupId} className="text-md text-gray-300">{label}</span>
      <div 
        role="group"
        aria-labelledby={ratingGroupId}
        className={`flex items-center ${disabled ? 'cursor-not-allowed' : ''}`} 
        onMouseLeave={() => !disabled && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !disabled && onRate(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            className="focus:outline-none"
            disabled={disabled}
            aria-label={`Rate ${star} star for ${label}`}
          >
            <StarIcon 
              className="h-5 w-5 transition-colors duration-200"
              style={{
                color: (hoverRating || rating) >= star ? accentColor : 'rgb(156 163 175)', // gray-400 for better contrast
                filter: !disabled && (hoverRating || rating) >= star ? `drop-shadow(0 0 3px ${accentColor})` : 'none',
                opacity: disabled ? 0.5 : 1
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingSystem;