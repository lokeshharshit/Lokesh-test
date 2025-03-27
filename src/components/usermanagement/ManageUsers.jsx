import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admindashboard.css";

const ManageUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="admin-header">Manage Users</h1>
      <p>Here you can manage user roles and profiles.</p>
    </div>
  );
};

export default ManageUsers;
