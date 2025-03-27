import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/manageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    UserName: "",
    Email: "",
    PasswordHash: "",
    RoleId: 2,
  });

  const apiUrl = "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/HttpTriggers";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredUsers(users.filter((user) =>
      user.UserName.toLowerCase().includes(value) ||
      user.Email.toLowerCase().includes(value)
    ));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setUpdatedUserData({ ...user });
  };

  const handleUpdateUser = async () => {
    try {
      const payload = {
        UserId: editingUser.UserId,  // Ensure UserId is included
        UserName: updatedUserData.UserName,
        Email: updatedUserData.Email,
        RoleId: updatedUserData.RoleId
      };
  
      console.log("Sending update request with payload:", payload);
  
      const response = await axios.put(apiUrl, payload, {
        headers: { "Content-Type": "application/json" }
      });
      
      alert("User updated successfully!");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Update failed:", error.response ? error.response.data : error.message);
      alert("Error updating user. Check console for details.");
    }
  };
  

  const handleCreateUser = async () => {
    try {
      await axios.post(apiUrl, newUserData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("User created successfully!");
      fetchUsers();
      setShowCreateModal(false);
      setNewUserData({ UserName: "", Email: "", PasswordHash: "", RoleId: 2 });
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="manage-users-header">
        <button className="back-btn" onClick={() => window.history.back()}>⬅ Back</button>
        <button className="add-user-btn" onClick={() => setShowCreateModal(true)}>➕ Add User</button>
      </div>

      {loading ? <p>Loading users...</p> : error ? <p className="error">{error}</p> : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.UserId}>
                <td>{user.UserName}</td>
                <td>{user.Email}</td>
                <td>
                  <select
                    value={user.RoleId}
                    onChange={(e) => setUpdatedUserData({ ...user, RoleId: parseInt(e.target.value) })}
                  >
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                    <option value="3">Guest</option>
                  </select>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Edit User Modal (NEWLY ADDED) */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>

            <label>Name:</label>
            <input
              type="text"
              value={updatedUserData.UserName}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, UserName: e.target.value })}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              value={updatedUserData.Email}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, Email: e.target.value })}
              required
            />

            <label>Role:</label>
            <select
              value={updatedUserData.RoleId}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, RoleId: parseInt(e.target.value) })}
            >
              <option value="1">Admin</option>
              <option value="2">User</option>
              <option value="3">Guest</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdateUser}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New User</h3>

            <label>Name:</label>
            <input
              type="text"
              value={newUserData.UserName}
              onChange={(e) => setNewUserData({ ...newUserData, UserName: e.target.value })}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              value={newUserData.Email}
              onChange={(e) => setNewUserData({ ...newUserData, Email: e.target.value })}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={newUserData.PasswordHash}
              onChange={(e) => setNewUserData({ ...newUserData, PasswordHash: e.target.value })}
              required
            />

            <label>Role:</label>
            <select
              value={newUserData.RoleId}
              onChange={(e) => setNewUserData({ ...newUserData, RoleId: parseInt(e.target.value) })}
            >
              <option value="1">Admin</option>
              <option value="2">User</option>
              <option value="3">Guest</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleCreateUser}>Create</button>
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
