import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../redux/slices/booksSlice";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { FiBookOpen, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import BookCard from "../../components/books/BookCard";

const Favorites = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { books, isLoading } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBooks({ page: currentPage, limit: 200 }));
  }, [dispatch]);

  const favoriteBooks = books.filter((book) =>
    user?.favoriteBooks?.some((fav) => fav._id === book._id)
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentFavorites = favoriteBooks.slice(
    startIdx,
    startIdx + itemsPerPage
  );
  const totalPages = Math.ceil(favoriteBooks.length / itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <FiHeart className="text-2xl text-red-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Favorite Books
        </h1>
        <span className="ml-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm">
          {user?.favoriteBooks.length} books
        </span>
      </div>

      {currentFavorites.length === 0 ? (
        <div className="text-center py-12">
          <FiBookOpen className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No favorite books yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start exploring our collection and add books to your favorites!
          </p>
          <Link to="/dashboard" className="btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentFavorites?.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Prev
              </button>

              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
