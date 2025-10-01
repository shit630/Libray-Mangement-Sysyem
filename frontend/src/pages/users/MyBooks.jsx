import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBorrowRequest,
  getMyBorrowRequests,
  returnBorrowBook,
} from "../../redux/slices/borrowRequestSlice";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiBook,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const MyBooks = () => {
  const dispatch = useDispatch();
  const { myBorrowRequests, isLoading } = useSelector(
    (state) => state.borrowRequests
  );

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getMyBorrowRequests());
  }, [dispatch]);

  const handleCancelBorrowRequest = (requestId) => {
    if (
      window.confirm("Are you sure you want to cancel this borrow request?")
    ) {
      dispatch(cancelBorrowRequest(requestId))
        .unwrap()
        .then(() => {
          toast.success("Borrow request cancelled successfully");
          dispatch(getMyBorrowRequests());
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleReturnBook = (requestId) => {
    if (
      window.confirm("Are you sure you want to mark this book as returned?")
    ) {
      dispatch(returnBorrowBook(requestId))
        .unwrap()
        .then(() => {
          toast.success("Book returned successfully");
          dispatch(getMyBorrowRequests());
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleRefresh = () => {
    dispatch(getMyBorrowRequests());
  };

  const filteredRequests = myBorrowRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "badge-warning", icon: FiClock, text: "Pending" },
      approved: {
        color: "badge-success",
        icon: FiCheckCircle,
        text: "Approved",
      },
      rejected: { color: "badge-danger", icon: FiXCircle, text: "Rejected" },
      returned: { color: "badge-info", icon: FiCheckCircle, text: "Returned" },
      overdue: { color: "badge-danger", icon: FiAlertCircle, text: "Overdue" },
      cancelled: {
        color: "badge-secondary",
        icon: FiXCircle,
        text: "Cancelled",
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`badge ${config.color} flex items-center`}>
        <Icon className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getActionButton = (request) => {
    switch (request.status) {
      case "pending":
        return (
          <button
            onClick={() => handleCancelBorrowRequest(request._id)}
            className="btn-danger text-sm cursor-pointer"
          >
            Cancel Request
          </button>
        );

      case "approved":
        return (
          <button
            onClick={() => handleReturnBook(request._id)}
            className="btn-primary text-sm"
          >
            Mark as Returned
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Books
        </h1>
        <button
          onClick={handleRefresh}
          className="btn-secondary flex items-center cursor-pointer"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("returned")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "returned"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Returned
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              filter === "cancelled"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "all"
                ? "You haven't borrowed any books yet."
                : `No ${filter} borrow requests.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request) => (
              <div key={request._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <img
                      src={
                        request.book?.image?.url || "/api/placeholder/100/150"
                      }
                      alt={request.book?.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {request.book?.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        by {request.book?.author}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        Requested:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {request.borrowDate && (
                        <div>
                          Due:{" "}
                          {new Date(
                            request.expectedReturnDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {request.actualReturnDate && (
                        <div>
                          Returned:{" "}
                          {new Date(
                            request.actualReturnDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {request.fineAmount > 0 && (
                        <div className="text-red-600 dark:text-red-400">
                          Fine: ${request.fineAmount}
                        </div>
                      )}
                    </div>

                    {getActionButton(request)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
