import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/ticketsList.css";

const TicketsList = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [comments, setComments] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // ✅ New State for Status Dropdown
  const { type } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch Users with RoleId = 1 (Admins)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const rolesResponse = await axios.get(
          "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsysuserroles"
        );

        const adminUserIds = rolesResponse.data
          .filter((role) => role.RoleId === 1)
          .map((role) => role.UserId);

        const response = await axios.get(
          "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/HttpTriggers"
        );

        let filteredUsers = response.data.filter((u) =>
          adminUserIds.includes(u.UserId)
        );

        // ✅ Include Logged-In User (Self)
        if (user) {
          const loggedInUser = response.data.find(
            (u) => u.UserId === user.UserId
          );
          if (loggedInUser) {
            filteredUsers = [loggedInUser, ...filteredUsers];
          }
        }

        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, [user?.UserId]);

  // ✅ Fetch Tickets API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger"
        );

        let filteredTickets = response.data;
        if (type === "assigned") {
          filteredTickets = response.data.filter(
            (ticket) => ticket.AdminId === user?.UserId
          );
        } else if (type === "active") {
          filteredTickets = response.data.filter(
            (ticket) => ticket.Status === "Open"
          );
        }

        setTickets(filteredTickets);
      } catch (err) {
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [type, user?.UserId]);

  // ✅ Fetch Comments and Status for Selected Ticket
  const fetchComments = async (ticketId) => {
    try {
      const response = await axios.get(
        `https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger?TicketId=${ticketId}`
      );
      if (response.status === 200) {
        setComments(response.data.Comments || "");
        setSelectedAdmin(response.data.AdminId || "");
        setSelectedStatus(response.data.Status || "Open"); // ✅ Set Initial Status
      }
    } catch (err) {
      console.error("Failed to fetch comments.");
    }
  };

  // ✅ Open Modal with Ticket Details, Comments & Status
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    fetchComments(ticket.TicketId);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setSelectedTicket(null);
    setComments("");
    setSelectedAdmin("");
    setSelectedStatus("");
  };

  // ✅ Handle Save (Assign, Comment & Status Update)
  const handleSave = async () => {
    if (!selectedTicket) return;

    const payload = {
      TicketId: selectedTicket.TicketId,
      AdminId: selectedAdmin || selectedTicket.AdminId,
      Comments: comments,
      Status: selectedStatus, // ✅ Updated Status
    };

    console.log("Payload Sent to API:", payload);

    try {
      const response = await axios.put(
        "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert("Ticket updated successfully.");
        closeModal();
        window.location.reload();
      } else {
        alert(`Failed to update ticket. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("PUT Request Error:", err.response?.data || err.message);
      alert("Failed to update ticket.");
    }
  };

  return (
    <div className="tickets-list-container">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <button
            className="back-button top-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h2 className="page-title">
            {type === "all"
              ? "All Tickets"
              : type === "assigned"
              ? "My Assigned Tickets"
              : "Active Tickets"}
          </h2>

          {error && <p className="error">{error}</p>}
          {!loading && !error && tickets.length === 0 && (
            <p>No tickets found.</p>
          )}

          <ul className="tickets-list">
            {tickets.map((ticket) => (
              <li
                key={ticket.TicketId}
                className="ticket-item"
                onClick={() => openModal(ticket)}
              >
                <p>
                  <strong>ID:</strong> {ticket.TicketId} |{" "}
                  <strong>Status:</strong> {ticket.Status}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {ticket.Description || "N/A"}
                </p>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {users.find((u) => u.UserId === ticket.AdminId)?.UserName ||
                    "Unassigned"}
                </p>
              </li>
            ))}
          </ul>

          {/* ✅ Modal for Ticket Details, Comments, Admin & Status */}
          {selectedTicket && (
            <div className="modal-overlay">
              <div className="modal-container">
                <h3 className="modal-title">Ticket Details</h3>
                <p>
                  <strong>ID:</strong> {selectedTicket.TicketId}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedTicket.Description || "N/A"}
                </p>

                {/* ✅ Status Dropdown in Place of Static Status */}
                <strong>Status:</strong>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-dropdown"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>

                {/* ✅ Assigned To Display */}
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {users.find((u) => u.UserId === selectedTicket.AdminId)
                    ?.UserName || "Unassigned"}
                </p>

                {/* ✅ Assign Dropdown */}
                {selectedTicket.Status !== "Closed" && (
                  <>
                    <strong>Reassign To:</strong>
                    <select
                      value={selectedAdmin}
                      onChange={(e) => setSelectedAdmin(e.target.value)}
                      className="assign-dropdown"
                    >
                      {user && (
                        <option value={user.UserId}>
                          {`${user?.UserName} (Assigned to Self)`}
                        </option>
                      )}
                      {users
                        .filter((u) => u.UserId !== user.UserId)
                        .map((u) => (
                          <option key={u.UserId} value={u.UserId}>
                            {u.UserName}
                          </option>
                        ))}
                    </select>
                  </>
                )}

                {/* ✅ Comment Box */}
                <strong>Comments:</strong>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="4"
                  className="comment-input"
                  placeholder="Add comments here..."
                ></textarea>

                <div className="modal-buttons">
                  <button onClick={handleSave} className="assign-btn">
                    Save
                  </button>
                  <button onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicketsList;
