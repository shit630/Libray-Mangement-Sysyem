import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../redux/slices/booksSlice";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { getBorrowRequests } from "../../redux/slices/borrowRequestSlice";
import { FiBook, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);
  const { borrowRequests } = useSelector((state) => state.borrowRequests);
  const [timeFilter, setTimeFilter] = useState("1month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        dispatch(fetchBooks({ page: 1, limit: 1000 })),
        dispatch(fetchUsers({ page: 1, limit: 1000 })),
        dispatch(getBorrowRequests({ page: 1, limit: 1000 })),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case "24hr":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "7days":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate = new Date("1970-01-01"); // no filter
    }

    return {
      books: books.filter((b) => new Date(b.createdAt) >= cutoffDate),
      users: users.filter((u) => new Date(u.createdAt) >= cutoffDate),
      borrowRequests: borrowRequests.filter(
        (r) => new Date(r.createdAt) >= cutoffDate
      ),
    };
  }, [timeFilter, books, users, borrowRequests]);

  const totalBooks = filteredData.books.length;
  const totalUsers = filteredData.users.length;
  const totalAdmins = filteredData.users.filter(
    (user) => user.role === "admin"
  ).length;
  const totalBorrowed = filteredData.borrowRequests.filter(
    (req) => req.status === "approved" || req.status === "returned"
  ).length;

  const revenue = filteredData.borrowRequests
    .filter((req) => req.status === "returned")
    .reduce((sum, req) => sum + req.totalAmount, 0);

  // Chart data
  const categoryData = Object.entries(
    filteredData.books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const statusData = [
    {
      name: "Pending",
      value: filteredData.borrowRequests.filter(
        (req) => req.status === "pending"
      ).length,
    },
    {
      name: "Approved",
      value: filteredData.borrowRequests.filter(
        (req) => req.status === "approved"
      ).length,
    },
    {
      name: "Returned",
      value: filteredData.borrowRequests.filter(
        (req) => req.status === "returned"
      ).length,
    },
    {
      name: "Rejected",
      value: filteredData.borrowRequests.filter(
        (req) => req.status === "rejected"
      ).length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Admin Panel
      </h1>

      {/* Time Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Dashboard Overview
          </h2>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="24hr">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="1month">Last Month</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
              <FiBook className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Books
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalBooks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
              <FiUsers className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalUsers}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalAdmins} admins
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mr-4">
              <FiTrendingUp className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Books Borrowed
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalBorrowed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-4">
              <FiDollarSign className="text-2xl text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ${revenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Books by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Books by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Number of Books" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Borrow Requests Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Borrow Requests Status
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.borrowRequests.slice(0, 5).map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.user?.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.book?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
