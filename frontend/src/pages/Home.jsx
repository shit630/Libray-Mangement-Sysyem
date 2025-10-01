import React from "react";
import { FiBook, FiStar, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to <span className="text-blue-600">LibraryHub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Your digital library management solution. Browse, borrow, and manage
            books with ease. Discover a world of knowledge at your fingertips.
          </p>
          <div className="flex justify-center gap-2">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
              Explore Books
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Why Choose LibraryHub?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We provide a seamless library experience with powerful features for
            both users and administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiBook className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Extensive Collection
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access thousands of books across various genres and categories.
              From fiction to academic resources.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FiUsers className="text-3xl text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              User-Friendly
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intuitive interface designed for all users. Easy browsing,
              borrowing, and management of your reading list.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FiStar className="text-3xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Smart Features
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced search, recommendations, reviews, and personalized
              reading suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who are already using LibraryHub to manage
            their reading experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Account
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              10,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Books Available
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              5,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              15,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Books Borrowed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              99%
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Satisfaction Rate
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
