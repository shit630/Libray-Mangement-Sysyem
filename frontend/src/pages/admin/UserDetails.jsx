import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchUser } from "../../redux/slices/usersSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { FiArrowLeft, FiUser } from "react-icons/fi";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, currentUser, error } = useSelector((state) => state.users);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchUser(id)).unwrap();
        console.log(currentUser);
      } catch (error) {
        toast.error("Failed to load user details");
        navigate("/admin/users");
        // return;
      }
    })();
  }, [dispatch, id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/admin/users"
        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </Link>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {currentUser.profilePicture?.url ? (
            <img
              src={currentUser.profilePicture.url}
              alt={currentUser.fullName}
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
              <FiUser className="text-gray-400 text-5xl" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {currentUser.fullName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold">Role:</span> {currentUser.role}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold">Date of Birth:</span>{" "}
              {new Date(currentUser.dateOfBirth).toLocaleDateString()}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold">Address:</span>{" "}
              {`${currentUser.address?.street || ""}, ${
                currentUser.address?.city || ""
              }, ${currentUser.address?.state || ""} ${
                currentUser.address?.pincode || ""
              }`}
            </p>
          </div>
        </div>
        {/* Favorite Books */}
        {currentUser.favoriteBooks?.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentUser.favoriteBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={book.image?.url || "/placeholder-book.png"}
                  alt={book.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    by {book.author}
                  </p>
                  <p className="text-yellow-500 text-sm">
                    ⭐ {book.ratings?.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentUser.borrowedBooks?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Borrowed Books
            </h3>
            <ul className="space-y-3">
              {currentUser.borrowedBooks.map((borrow, idx) => {
                <li
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start space-x-4 shadow-sm"
                >
                  {/* Book Image */}
                  {borrow.book?.image?.url && (
                    <img
                      src={borrow.book.image.url}
                      alt={borrow.book.title}
                      className="w-16 h-20 object-cover rounded-md shadow"
                    />
                  )}

                  {/* Book Info */}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {borrow.book?.title || "Unknown Title"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      by {borrow.book?.author || "Unknown Author"}
                    </p>
                    {borrow.book?.ratings && (
                      <p className="text-sm text-yellow-500">
                        ⭐ {borrow.book.ratings.toFixed(1)}
                      </p>
                    )}

                    {/* Borrow Info */}
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <span className="font-semibold">Borrowed:</span>{" "}
                        {new Date(borrow.borrowedDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Return:</span>{" "}
                        {borrow.returnDate
                          ? new Date(borrow.returnDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            borrow.status === "Returned"
                              ? "bg-green-100 text-green-800"
                              : borrow.status === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {borrow.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
