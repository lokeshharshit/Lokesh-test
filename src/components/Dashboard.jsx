import React, { useState, useEffect } from "react";
import "../styles/dashboard.css"; // Ensure correct styles
import AddForm from "./AddForm";

const Dashboard = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    document.body.classList.add("dashboard-page");
    return () => {
      document.body.classList.remove("dashboard-page");
    };
  }, []);

  // Service Categories Data
  const categories = [
    {
      name: "Accounts & Access",
      description: "Click here to raise an accounts or access request.",
      icon: "🔑",
    },
    {
      name: "Hardware",
      description: "Click here to raise a hardware request.",
      icon: "💻",
    },
    {
      name: "Software",
      description: "Click here to raise a software request for install or purchase.",
      icon: "📦",
    },
    {
      name: "Other Services",
      description: "Click here to raise all other requests including a service request.",
      icon: "❓",
    },
  ];

  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        {!selectedCategory ? (
          <>
            <h2 id="dashboard-title" className="text-center">
              Service Categories
            </h2>
            <div className="search-container">
              <input
                type="text"
                className="search-box"
                placeholder="Search..."
              />
            </div>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="category-card"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h5>{category.name}</h5>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="add-form-wrapper">
            <AddForm
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
              user={user}
            />
          </div>
        )}
        <div id="dashboard-other-options" className="other-options">
          <h3>Other Dashboard Features</h3>
          <p>This is where other dashboard functionalities remain.</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
