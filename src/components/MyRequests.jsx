import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/myRequests.css";
import { FaSpinner } from "react-icons/fa"; // Import Spinner Icon

const MyRequests = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  // Static Admin Mapping (Replace this with API call if needed)
  const adminMapping = {
    1: "John Doe",
    2: "Jane Smith",
    3: "Michael Brown",
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger",
          {
            params: { UserId: user?.UserId },
          }
        );
        setTickets(response.data);
      } catch (err) {
        setError("Failed to fetch tickets.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTickets();
  }, [user]);

  // Function to extract file names from multiple attachment URLs
  const extractFileNames = (attachments) => {
    if (!attachments) return "No Attachment";

    const filesArray = Array.isArray(attachments)
      ? attachments
      : attachments.split(";");

    return filesArray
      .map((url) => {
        const filename = url.split("/").pop(); // Get the last part of URL
        return filename.replace(/^\d+-/, ""); // Remove timestamp prefix
      })
      .join(", ");
  };

  return (
    <div className="my-requests-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>{" "}
      {/* Back button */}
      <h2>My Requests</h2>

      {/* Show Spinner while loading */}
      {loading && (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
)}

      {error && <p className="error">{error}</p>}
      {!loading && !error && tickets.length === 0 && <p>No tickets found.</p>}

      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.TicketId} className="ticket-item">
            <strong>ID:</strong> {ticket.TicketId} |{" "}
            <strong>Status:</strong> {ticket.Status}
            {ticket.AdminId && (
              <p>
                <strong>Assigned Admin:</strong>{" "}
                {adminMapping[ticket.AdminId] || "Unknown Admin"}
              </p>
            )}
            <p>
              <strong>Description:</strong>
            </p>
            <p>{ticket.Description}</p>
            {ticket.Attachment && (
              <p>
                <strong>Attachments:</strong>{" "}
                {extractFileNames(ticket.Attachment)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRequests;
