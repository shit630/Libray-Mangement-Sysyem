import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { toast } from "react-toastify";

const ReviewForm = ({ handleAddReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    handleAddReview({ rating, comment });
    setRating(0);
    setComment("");
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Write a Review
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none cursor-pointer"
              >
                <FiStar
                  className={`${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="input-field"
            placeholder="Share your thoughts about this book..."
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
