import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMapPin,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, registerUers } from "../../redux/slices/AuthSlice";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    role: "user",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [error, isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePicture(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    let submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("dateOfBirth", formData.dateOfBirth);
    submitData.append("role", formData.role);
    submitData.append("address", JSON.stringify(formData.address));

    if (profilePicture) {
      submitData.append("profilePicture", profilePicture);
    }
    // submitData = Object.fromEntries(submitData.entries());
    dispatch(registerUers(submitData));

    setFormData({
      fullName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      role: "user",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    });
    setProfilePicture(null);
    setProfilePreview("");
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-md mx-auto mt-15">
      <div className="card mb-15">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join our librarry community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-3xl text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
              >
                <FiCamera className="text-sm" />
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a profile picture
            </p>
          </div>

          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
              Date of Birth *
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input-field pl-10"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
              Register as *
            </label>
            <div className="relative">
              <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field pl-10"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
              Street Address *
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address.street"
                required
                value={formData.address.street}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your street address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                name="address.city"
                required
                value={formData.address.city}
                onChange={handleChange}
                className="input-field"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State *
              </label>
              <input
                type="text"
                name="address.state"
                required
                value={formData.address.state}
                onChange={handleChange}
                className="input-field"
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pincode *
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address.pincode"
                required
                value={formData.address.pincode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pincode"
                className="input-field pl-10"
                placeholder="6-digit pincode"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {" "}
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
