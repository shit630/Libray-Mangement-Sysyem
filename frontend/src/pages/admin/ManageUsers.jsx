import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { debounce, throttle } from "lodash";
import {
  clearCurrentUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/usersSlice";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { FiEye, FiSearch, FiTrash2, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const LIMIT = 5;

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { users, isLoading, pagination } = useSelector((state) => state.users);

  const totalPages = pagination?.totalPages ?? 0;

  const isLoadingRef = useRef(isLoading);
  const currentPageRef = useRef(currentPage);
  const totalPagesRef = useRef(totalPages);
  const isFetchingMoreRef = useRef(isFetchingMore);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);
  useEffect(() => {
    isFetchingMoreRef.current = isFetchingMore;
  }, [isFetchingMore]);

  // Fetch userss whenever filters/search/page change
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // ensure page is at least 1
        const pageToFetch = Math.max(1, Number(currentPage));
        const params = {
          page: pageToFetch,
          limit: LIMIT,
          search: debouncedSearch || undefined,
          role: role || undefined,
        };

        await dispatch(fetchUsers(params)).unwrap();

        if (!isMounted) return;

        setIsFetchingMore(false);
      } catch (error) {
        if (!isMounted) return;
        setIsFetchingMore(false);
        if ((users?.length ?? 0) === 0) {
          toast.dismiss();
          toast.error("Failed to load users");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch, debouncedSearch, role, currentPage]);

  // Create ONE stable throttled scroll handler that reads latest via refs
  const throttledScrollHandler = useMemo(() => {
    const fn = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      // near bottom threshold (250px)
      if (scrollTop + clientHeight < scrollHeight - 250) return;

      // use refs to get latest values
      if (isLoadingRef.current) return;
      if (isFetchingMoreRef.current) return;
      if (currentPageRef.current >= (totalPagesRef.current || 0)) return;

      // If okay — trigger fetch for next page
      setIsFetchingMore(true);
      setCurrentPage((p) => p + 1);
    };

    // throttle interval 500ms (adjust as needed)
    return throttle(fn, 500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);

      throttledScrollHandler.cancel();
    };
  }, [throttledScrollHandler]);

  // Create debounced function
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 300), //300ms delay
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
    setCurrentPage(1); // reset to first page
    setIsFetchingMore(false);
    dispatch(clearCurrentUser());
  };

  const handleRoleFilter = (value) => {
    setRole(value);
    setCurrentPage(1);
    setIsFetchingMore(false);
  };

  const handleView = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => toast.success("User deleted successfully"))
      .catch((err) => toast.error(err || "Delete failed"));
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, userData: { role: newRole } }))
      .unwrap()
      .then(() => {
        toast.success("User role updated successfully");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Manage Users
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Users
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search filters"
                : "No users registered yet."}
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profilePicture?.url ? (
                          <img
                            src={user.profilePicture.url}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full mr-4"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                            <FiUser className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user._id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.address?.city}, {user.address?.state}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(user._id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        >
                          <FiEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* bottom spinner for loading more */}
            {isFetchingMore ||
              (isLoading && users?.length > 0 && (
                <div className="text-center p-4">
                  <LoadingSpinner size="small" />
                </div>
              ))}

            {/* No more indicator */}
            {currentPage >= totalPages && !isLoading && users?.length > 0 && (
              <p className="text-center p-4 text-gray-500 dark:text-gray-400">
                No more users to load
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
