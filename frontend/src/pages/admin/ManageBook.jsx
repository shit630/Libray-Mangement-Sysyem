import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { toast } from "react-toastify";

import {
  clearCurrentBook,
  deleteBook,
  fetchBooks,
} from "../../redux/slices/booksSlice";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import BookForm from "../../components/admin/BookForm";

const ManageBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    sort: "",
    minRating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const LIMIT = 5;

  const dispatch = useDispatch();
  const { books, isLoading, pagination } = useSelector((state) => state.books);

  // Fetch books whenever filters/search/page change
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const pageToFetch = Math.max(1, Number(currentPage));
        const params = {
          page: pageToFetch,
          limit: LIMIT,
          search: debouncedSearch || undefined,
          category: filters.category || undefined,
          sort: filters.sort || undefined,
          minRating: filters.minRating > 0 ? filters.minRating : undefined,
        };

        await dispatch(fetchBooks(params)).unwrap();
      } catch (err) {
        if (!isMounted) return;
        if ((books?.length ?? 0) === 0) {
          toast.dismiss();
          toast.error("Failed to load books");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch, debouncedSearch, filters, currentPage]);

  // Debounced search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setCurrentPage(1);
  };

  const handleDelete = (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    dispatch(deleteBook(bookId))
      .unwrap()
      .then(() => toast.success("Book deleted successfully"))
      .catch((err) => toast.error(err || "Delete failed"));
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    setCurrentPage(1);
    dispatch(fetchBooks({ page: 1, limit: LIMIT })).catch(() => {});
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Mystery",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Science",
    "Technology",
    "Romance",
    "Thriller",
    "Children",
    "Other",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manage Books
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" /> Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Books
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) =>
                handleFilterChange(
                  "minRating",
                  parseInt(e.target.value || 0, 10)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       dark:bg-gray-700 dark:text-white"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       dark:bg-gray-700 dark:text-white"
            >
              <option value="">Default (Newest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="rating_asc">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {(!books || books.length === 0) && !isLoading ? (
          <div className="text-center py-12">
            <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filters.category
                ? "Try adjusting your search filters"
                : "No books available. Add your first book!"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {books?.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {/* Title + Author + Thumbnail */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              book.image?.url ||
                              "https://parallel.cymru/wp-content/uploads/Generic-Book-Placeholder-icon-300x300.png"
                            }
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded mr-4"
                            loading="lazy"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {book.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              by {book.author}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {book.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${Number(book.price).toFixed(2)}
                      </td>

                      {/* Availability */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${
                            (book.availableCopies ?? 0) > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {book.availableCopies ?? 0} / {book.totalCopies}{" "}
                          available
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 dark:text-white mr-2">
                            {(book.ratings ?? 0).toFixed(1)}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(book.ratings || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300 dark:text-gray-500"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({book.reviews?.length || 0})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          >
                            <FiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
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
            </div>
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex my-5 justify-center space-x-4">
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
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
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
          </>
        )}
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={handleCloseForm}
          OnSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ManageBook;
