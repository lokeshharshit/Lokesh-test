import React from "react";

const UserDetails = ({ user, onLogout }) => {
  return (
    <div className="card text-center p-4 shadow" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">User Details:</h3>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default UserDetails;
