import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/managetickets.css";

const ManageTickets = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger"
        );
        setTickets(response.data);
      } catch (err) {
        setError("Failed to fetch tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // ✅ Filter Functions
  const allTickets = tickets;
  const myAssignedTickets = tickets.filter(
    (ticket) => ticket.AdminId === user?.UserId
  );
  const activeTickets = tickets.filter((ticket) => ticket.Status === "Open");

  // ✅ Handle Navigation with Dynamic Query
  const navigateToList = (type) => {
    let queryParams = "";
    if (type === "assigned") {
      queryParams = `?UserId=${user?.UserId}`;
    } else if (type === "active") {
      queryParams = `?Status=Open`;
    }
    navigate(`/tickets-list/${type}${queryParams}`);
  };

  return (
    <div className="manage-tickets-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Manage Tickets</h2>
      {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="card-container">
          <div className="card" onClick={() => navigateToList("all")}>
            <div className="card-icon">🎟️</div>
            <h4 className="card-title">All Tickets</h4>
            <p>Total: {allTickets.length}</p>
          </div>

          <div className="card" onClick={() => navigateToList("assigned")}>
            <div className="card-icon">🙋‍♂️</div>
            <h4 className="card-title">My Assigned Tickets</h4>
            <p>Total: {myAssignedTickets.length}</p>
          </div>

          <div className="card" onClick={() => navigateToList("active")}>
            <div className="card-icon">🔥</div>
            <h4 className="card-title">Active Tickets</h4>
            <p>Total: {activeTickets.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
