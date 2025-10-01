// src/components/books/BookCard.jsx
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBook, FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/slices/booksSlice";
import { toast } from "react-toastify";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const BookCard = ({ book, isLoading = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { books, isLoading: booksLoading } = useSelector(
    (state) => state.books
  );

  const [imageError, setImageError] = useState(false);

  // ✅ Always derive "isFavorite" from Redux state (fresh copy)
  const isFavorite = useMemo(() => {
    const updated = books.find((b) => b._id === book._id);
    return updated ? updated.isFavorite : book?.isFavorite || false;
  }, [books, book]);

  const handleFavoriteClick = () => {
    if (!user) {
      toast.error("Please login to manage favorites");
      return;
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(book._id))
        .unwrap()
        .then(() => toast.success("Removed from favorites"))
        .catch(() => toast.error("Failed to remove from favorites"));
    } else {
      dispatch(addToFavorites(book._id))
        .unwrap()
        .then(() => toast.success("Added to favorites"))
        .catch(() => toast.error("Failed to add to favorites"));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" count={12} />;
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col 
      transform transition-all duration-700 hover:shadow-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-800/70"
    >
      {/* Image */}
      <div className="relative w-full aspect-[2/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FiBook className="text-4xl text-gray-400" />
          </div>
        ) : (
          <img
            src={book.image?.url || "https://via.placeholder.com/300x400"}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}

        {user && (
          <button
            onClick={handleFavoriteClick}
            disabled={booksLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white"
            } ${booksLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiHeart
              className={`text-lg cursor-pointer ${
                isFavorite ? "fill-current" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/books/${book._id}`} className="flex-1">
          <h3
            className="font-semibold text-lg text-gray-800 dark:text-white mb-2 
            hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
          >
            {book.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-1">
          by {book.author}
        </p>

        {/* Rating & Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {book.ratings?.toFixed(1) || "0.0"} ({book.numOfReviews || 0})
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {book.category}
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${book.price}
          </span>
          <span
            className={`text-xs font-medium ${
              book.availableCopies > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {book.availableCopies > 0
              ? `${book.availableCopies} available`
              : "Out of stock"}
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/books/${book._id}`}
          className="block w-full mt-4 bg-blue-600 text-white text-center py-2 rounded-lg 
          hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors text-sm md:text-base"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
