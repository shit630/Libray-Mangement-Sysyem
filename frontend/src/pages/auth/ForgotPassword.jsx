import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, forgotPassword } from "../../redux/slices/AuthSlice";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [error, isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    dispatch(forgotPassword(email));

    setEmail("");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>

      <div className="card my-20 mx-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-10"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3">
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Success Message (shown after submission) */}
      {!isLoading && !error && (
        <div className="mt-5 p-4 mx-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-center">
            If an account with that email exists, we've sent a password reset
            link. Please check your inbox.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
