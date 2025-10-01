import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { getMe } from "../../redux/slices/AuthSlice";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
