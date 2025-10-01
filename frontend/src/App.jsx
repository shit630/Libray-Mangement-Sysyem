import "./App.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import ThemeContextProvider from "./context/ThemeContext";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import { useEffect } from "react";
import { getMe } from "./redux/slices/AuthSlice";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import AdminRoute from "./components/routing/AdminRoute";
import ManageBook from "./pages/admin/ManageBook";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import Dashboard from "./pages/users/Dashboard";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Profile from "./pages/users/Profile";
import BookDetails from "./components/books/BookDetails";
import Favorites from "./pages/users/Favorites";
import ManageBorrowRequests from "./pages/admin/ManageBorrowRequests";
import MyBooks from "./pages/users/MyBooks";
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const authState = localStorage.getItem("authState");
    const isAuthState = ["/login", "/register"].includes(location.pathname);

    if (authState && !isAuthState) {
      dispatch(getMe());
    }
  }, [dispatch, location.pathname]);

  if (isLoading && localStorage.getItem("authState")) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {/* <Router> */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route
              path="/resetpassword/:resettoken"
              element={<ResetPassword />}
            />
            <Route path="/books/:id" element={<BookDetails />} />

            {/* Protected user routes */}
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/admin-panel"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/books"
              element={
                <AdminRoute>
                  <ManageBook />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <UserDetails />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/borrow-requests"
              element={
                <AdminRoute>
                  <ManageBorrowRequests />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      {/* </Router> */}
    </>
  );
}

export default App;
