import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaClipboardList } from "react-icons/fa";
import "../styles/admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>

      {/* Card Options */}
      <div className="card-container">
        <div className="card" onClick={() => handleCardClick("/manage-users")}>
          <FaUser className="card-icon" style={{ color: "green" }} />
          <h3 className="card-title">Users</h3>
          <p>Manage user roles and profiles</p>
        </div>
        <div className="card" onClick={() => handleCardClick("/manage-tickets")}>
          <FaClipboardList className="card-icon" style={{ color: "orange" }} />
          <h3 className="card-title">Tickets</h3>
          <p>Track and resolve support tickets</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
