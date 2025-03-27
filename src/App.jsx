import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/usermanagement/Login";
import ForgotPassword from "./components/usermanagement/ForgotPassword";
import ManageUsers from "./components/usermanagement/ManageUsers";
import Dashboard from "./components/Dashboard";
import ServiceCategories from "./components/ServiceCategories";
import AddForm from "./components/AddForm";
import MyRequests from "./components/MyRequests";
import AdminDashboard from "./components/AdminDashboard";
import ManageTickets from "./components/ticketsmanagement/ManageTickets";
import TicketsList from "./components/ticketsmanagement/TicketsList";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  // State to store the logged-in user
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // State to control forgot password screen
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle user login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div>
        {/* Show Header if user is authenticated */}
        {user && <Header user={user} onLogout={handleLogout} />}

        <main>
          <Routes>
            {/* Home/Login Route */}
            <Route
              path="/"
              element={
                showForgotPassword ? (
                  <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
                ) : user ? (
                  user.RoleId === 1 ? (
                    <Navigate to="/admin-dashboard" />
                  ) : (
                    <Dashboard user={user} />
                  )
                ) : (
                  <Login onLogin={handleLogin} setShowForgotPassword={setShowForgotPassword} />
                )
              }
            />

            {/* Forgot Password */}
            <Route
              path="/forgot-password"
              element={<ForgotPassword setShowForgotPassword={setShowForgotPassword} />}
            />

            {/* Authenticated Routes */}
            {user ? (
              <>
                <Route path="/my-requests" element={<MyRequests user={user} />} />
                <Route path="/service-categories" element={<ServiceCategories />} />
                <Route path="/add/:category" element={<AddForm user={user} />} />
                {user.RoleId === 1 && (
                  <>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/manage-tickets" element={<ManageTickets user={user} />} />
                    <Route path="/tickets-list/:type" element={<TicketsList user={user} />} />
                  </>
                )}
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </main>

        {/* Show Footer if user is authenticated */}
        {user && <Footer />}
      </div>
    </Router>
  );
};

export default App;
