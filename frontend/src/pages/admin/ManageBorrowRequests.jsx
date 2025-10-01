import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBorrowRequests,
  updateBorrowRequest,
} from "../../redux/slices/borrowRequestSlice";
import { toast } from "react-toastify";
import { FiCheck, FiClock, FiSearch, FiUser, FiX } from "react-icons/fi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { debounce } from "lodash";

const ManageBorrowRequests = () => {
  const dispatch = useDispatch();
  const { borrowRequests, pagination, isLoading } = useSelector(
    (state) => state.borrowRequests
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getBorrowRequests({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || "",
        status: statusFilter !== "all" ? statusFilter : "",
      })
    );
  }, [dispatch, currentPage, debouncedSearch, statusFilter]);

  // Debounced search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value.trim());
        setCurrentPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSearch = (e) => {
    debouncedSetSearch(e.target.value);
    setSearchTerm(e.target.value);
  };

  console.log(borrowRequests);

  const handleStatusUpdate = (requestId, newStatus) => {
    dispatch(updateBorrowRequest({ id: requestId, status: newStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Request ${newStatus} successfully`);
        dispatch(
          getBorrowRequests({
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            status: statusFilter !== "all" ? statusFilter : "",
          })
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "badge-warning", icon: FiClock, text: "Pending" },
      approved: { color: "badge-success", icon: FiCheck, text: "Approved" },
      rejected: { color: "badge-danger", icon: FiX, text: "Rejected" },
      returned: { color: "badge-info", text: "Returned" },
      overdue: { color: "badge-danger", text: "Overdue" },
      cancelled: { color: "badge-secondary", text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`badge ${config.color} flex items-center`}>
        {Icon && <Icon className="mr-1" />}
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Manage Borrow Requests
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Requests
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or book..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setCurrentPage(1);
                setStatusFilter(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {borrowRequests.length == 0 ? (
          <div className="text-center py-12">
            <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search filters"
                : "No borrow requests yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {borrowRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                          {request.user?.profilePicture?.url ? (
                            <img
                              src={request.user?.profilePicture?.url}
                              alt={request.user?.fullName}
                              className="profile-image"
                            />
                          ) : (
                            <div className="profile-image-placeholder">
                              <FiUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.user?.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {request.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.book?.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        by {request.book?.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Borrow:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Expected Return:{" "}
                        {new Date(
                          request.expectedReturnDate
                        ).toLocaleDateString()}
                      </div>
                      {request.actualReturnDate && (
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Returned:{" "}
                          {new Date(
                            request.actualReturnDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ${request.totalAmount.toFixed(2)}
                      </div>
                      {request.fineAmount > 0 && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          Fine: ${request.fineAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request._id, "approved")
                              }
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Approve"
                            >
                              <FiCheck className="text-lg cursor-pointer" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request._id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Reject"
                            >
                              <FiX className="text-lg cursor-pointer" />
                            </button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(request._id, "returned")
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Mark as Returned"
                          >
                            <FiCheck className="text-lg cursor-pointer" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex my-5 justify-center space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {" "}
            Prev
          </button>

          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {pagination.totalPages || 1}
          </span>

          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === pagination.totalPages
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBorrowRequests;
