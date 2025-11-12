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

  // console.log(currentUser.borrowedBooks);
  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchUser(id)).unwrap();
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
        {/* {currentUser.favoriteBooks?.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentUser.favoriteBooks.map((book, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                {console.log(book)}
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
        )} */}
      </div>
    </div>
  );
};

export default UserDetails;
