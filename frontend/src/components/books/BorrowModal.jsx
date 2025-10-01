import React, { useState } from "react";
import { FiCalendar, FiDollarSign, FiX } from "react-icons/fi";

const BorrowModal = ({
  book,
  returnDate,
  onClose,
  onConfirm,
  onChangeReturnDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(returnDate);
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onChangeReturnDate(newDate);
  };

  const calculateTotal = () => {
    const tax = book.price * 0.1;
    return book.price + tax;
  };

  const getMaxReturnDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 14 days max
    return maxDate.toISOString().split("T")[0];
  };

  const getMinReturnDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Tomorrow
    return minDate.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Borrow "{book.title}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Return Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={getMaxReturnDate()}
                min={getMinReturnDate()}
                className="input-field pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Select the date you expect to return the book by.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
              Payment Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Borrowing fee
                </span>
                <span className="text-gray-800 dark:text-white">
                  ${book.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Tax (10%)
                </span>
                <span className="text-gray-800 dark:text-white">
                  ${(book.price * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                <span className="font-semibold text-gray-800 dark:text-white">
                  Total
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedDate)}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <FiDollarSign className="mr-2" />
              Confirm Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;
