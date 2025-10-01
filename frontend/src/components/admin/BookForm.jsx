import React, { useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { createBook, updateBook } from "../../redux/slices/booksSlice";
import { toast } from "react-toastify";

const BookForm = ({ book, onClose, OnSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    publicationYear: new Date().getFullYear(),
    isbn: "",
    price: "",
    totalCopies: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        category: book.category || "",
        publicationYear: book.publicationYear || new Date().getFullYear(),
        isbn: book.isbn || "",
        price: book.price || "",
        totalCopies: book.totalCopies || "",
        image: null,
      });
      if (book.image?.url) {
        setImagePreview(book.image.url);
      }
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("publicationYear", formData.publicationYear);
      submitData.append("isbn", formData.isbn);
      submitData.append("price", formData.price);
      submitData.append("totalCopies", formData.totalCopies);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (book) {
        await dispatch(
          updateBook({ id: book._id, bookData: submitData })
        ).unwrap();
        toast.success("Book updated successfully");
      } else {
        await dispatch(createBook(submitData)).unwrap();
        toast.success("Book created successfully");
      }

      OnSuccess();
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium mb-2">ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="input-field"
                required
                pattern="\d{10}|\d{13}"
                title="Please enter a valid ISBN (10 or 13 digits)"
              />
            </div>

            {/* Publication Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Publication Year *
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className="input-field"
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Totalcopies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
            </div>

            {/* Book Cover */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Book Cover
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex flex-col items-center justify-center w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Book cover preview"
                    className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
