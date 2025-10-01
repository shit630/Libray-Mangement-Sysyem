import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiStar,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useEffect } from "react";
import {
  addReview,
  addToFavorites,
  fetchBook,
  removeFromFavorites,
} from "../../redux/slices/booksSlice";
import { toast } from "react-toastify";
import { createBorrowRequest } from "../../redux/slices/borrowRequestSlice";
import ReviewForm from "./ReviewForm";
import BorrowModal from "./BorrowModal";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBook, isLoading } = useSelector((state) => state.books);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { myBorrowRequest } = useSelector((state) => state.borrowRequests);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedReturnDate, setSelectedReturnDate] = useState("");

  useEffect(() => {
    dispatch(fetchBook(id));
  }, [dispatch, id]);

  const userBorrowRequest = myBorrowRequest?.find(
    (req) => req.book._id === id && ["pending", "approved"].includes(req.status)
  );

  const handleAddReview = (reviewData) => {
    dispatch(addReview({ bookId: id, reviewData }))
      .unwrap()
      .then(() => {
        toast.success("Review added successfully");
        dispatch(fetchBook(id));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to favorites");
    }
    if (currentBook?.isFavorite) {
      dispatch(removeFromFavorites(id));
      toast.success("Removed from favorites");
    } else {
      dispatch(addToFavorites(id));
      toast.success("Added to favorites");
    }
  };

  const handleBorrow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to borrow books");
      return;
    }

    if (userBorrowRequest) {
      if (userBorrowRequest.status === "pending") {
        toast.info("You already have a pending request for this book");
      } else if (userBorrowRequest.status === "approved") {
        toast.info("You have already borrowed this book");
      }
      return;
    }

    setSelectedReturnDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    );
    setShowBorrowModal(true);
  };

  const confirmBorrow = (returnDate) => {
    dispatch(
      createBorrowRequest({ bookId: id, expectedReturnDate: returnDate })
    )
      .unwrap()
      .then(() => {
        toast.success("Borrow request submitted successfully");
        setShowBorrowModal(false);
        dispatch(fetchBook(id));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const renderBorrowButton = () => {
    if (!isAuthenticated) {
      return (
        <button
          onClick={() => navigate("/login")}
          className="w-full btn-primary mt--4"
        >
          Login to Borrow
        </button>
      );
    }

    if (userBorrowRequest) {
      const statusConfig = {
        pending: {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          text: "Request Pending",
          icon: FiClock,
        },
        approved: {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          text: "Currently Borrowed",
          icon: FiCheckCircle,
        },
        rejected: {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          text: "Request Rejected",
          icon: FiXCircle,
        },
      };

      const config =
        statusConfig[userBorrowRequest.status] || statusConfig.pending;
      const Icon = config.icon;

      return (
        <div
          className={`w-full mt-4 p-3 rounded-lg text-center ${config.color} flex items-center justify-center`}
        >
          <Icon className="mr-2" />
          {config.text}
        </div>
      );
    }

    if (currentBook.availableCopies > 0) {
      return (
        <button onClick={handleBorrow} className="w-full btn-primary mt-4">
          Borrow Book
        </button>
      );
    }

    return (
      <div className="text-red-600 dark:text-red-400 mt-4 text-center">
        Currently unavailable
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentBook) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Book not found
        </h2>
        <button onClick={() => navigate("/dashboard")} className="btn-primary">
          Back to Books
        </button>
      </div>
    );
  }

  const tax = currentBook.price * 0.1;
  const totalAmount = currentBook.price + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 cursor-pointer"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex md:space-x-6">
          <div className="md:w-1/3 p-6">
            <div className="flex justify-center">
              <img
                src={currentBook.image?.url || "/api/placeholder/400/600"}
                alt={currentBook.title}
                className="w-full max-w-sm aspect-[2/3] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${currentBook.price}
              </div>

              {isAuthenticated && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-full ${
                    currentBook.isFavorite
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  } hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300`}
                >
                  <FiHeart
                    className={`text-xl cursor-pointer ${
                      currentBook.isFavorite ? "fill-current" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {renderBorrowButton()}
            {currentBook.availableCopies === 0 && (
              <div className="text-red-600 dark:text-red-400 mt-4 text-center">
                Currently unavailable
              </div>
            )}
          </div>

          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentBook.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              by {currentBook.author}
            </p>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <FiStar className="text-yellow-400 mr-1" />
                <span className="text-gray-700 dark:text-gray-300">
                  {currentBook.ratings?.toFixed(1) || "0.0"} (
                  {currentBook.reviews.length || 0} reviews)
                </span>
              </div>

              <div className="badge badge-info">{currentBook.category}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiCalendar className="mr-2" />
                <span>Published: {currentBook.publicationYear}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiBookOpen className="mr-2" />
                <span>ISBN: {currentBook.isbn}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiClock className="mr-2" />
                <span>Borrowed: {currentBook.borrowedCount || 0} times</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiBookOpen className="mr-2" />
                <span>
                  Available: {currentBook.availableCopies} of{" "}
                  {currentBook.totalCopies}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentBook.description}
              </p>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Pricing Breakdown
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Borrowing fee
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    ${currentBook.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Tax (10%)
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Total
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Reviews
          </h3>

          {isAuthenticated && <ReviewForm handleAddReview={handleAddReview} />}

          <div className="space-y-4 mt-6">
            {currentBook.reviews?.length > 0 ? (
              currentBook.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <FiUser className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {review.user?.fullName || "Anonymous"}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No reviews yet. Be the first to review this book!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <BorrowModal
          book={currentBook}
          returnDate={selectedReturnDate}
          onClose={() => setShowBorrowModal(false)}
          onConfirm={confirmBorrow}
          onChangeReturnDate={setSelectedReturnDate}
        />
      )}
    </div>
  );
};

export default BookDetails;
