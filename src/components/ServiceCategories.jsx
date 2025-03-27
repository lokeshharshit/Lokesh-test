import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/serviceCategories.css"; // Ensure correct styling

const ServiceCategories = () => {
  const navigate = useNavigate();

  // Category Data
  const categories = [
    { name: "Accounts & Access", description: "Click here to raise an accounts or access request.", icon: "🔑" },
    { name: "Hardware", description: "Click here to raise a hardware request.", icon: "💻" },
    { name: "Software", description: "Click here to raise a software request for install or purchase.", icon: "📦" },
    { name: "Other Service Requests", description: "Click here to raise all other requests including a service request.", icon: "❓" },
  ];

  return (
    <div className="service-categories-container">
      <h2 className="text-center">Service Categories</h2>
      <div className="search-container">
        <input type="text" className="search-box" placeholder="Search..." />
      </div>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card" onClick={() => navigate(`/add/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}>
            <div className="category-icon">{category.icon}</div>
            <h5>{category.name}</h5>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
