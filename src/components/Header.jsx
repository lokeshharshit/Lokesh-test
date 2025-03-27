import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { FaListAlt  } from "react-icons/fa";

const Header = ({ user, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();

  // ✅ Handle mouse enter (show)
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(true);
  };

  // ✅ Handle mouse leave (hide with delay)
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Delay of 300ms
    setHoverTimeout(timeout);
  };

  // ✅ Navigate to Profile/Account Details
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header>
      <h6>WinITSupport</h6>

      <nav className="nav-container">
        <ul className="nav-list">
          {user ? (
            <>
        <li className="nav-item">
  <Link className="nav-link" to="/my-requests">
    <FaListAlt className="my-requests-icon" />    
  </Link>
</li>
        

              <li
                className="nav-item profile-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="profile-icon">
                  {user.UserName.charAt(0).toUpperCase()}
                </div>
                {isHovered && (
                  <div className="hover-container">
                    <span className="hover-username">{user.UserName}</span>

                    {/* ✅ Profile/Account Details Button */}
                    <button
                      className="hover-profile"
                      onClick={handleProfileClick}
                    >
                      Account Details
                    </button>

                    {/* ✅ Logout Button */}
                    <button className="hover-logout" onClick={onLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
