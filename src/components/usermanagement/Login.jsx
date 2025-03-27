import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = ({ onLogin, setShowForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and Password are required");
      return;
    }

    try {
      const apiUrl = "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/HttpTriggers";

      console.log("🔄 Sending login request to API...");

      const response = await axios.post(apiUrl, {
        UserName: username,
        PasswordHash: password,
        Login: true,
      });

      if (response.status === 200 && response.data) {
        const userData = response.data;

        // console.log("🟢 Extracted User Data:", userData); // ✅ Log extracted user data

        if (!userData.RoleId) {
          console.error("⚠️ RoleId is missing in API response!");
          setError("RoleId is missing in API response. Contact support.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(userData)); // Save user data
        onLogin(userData);

        console.log("🔀 Redirecting based on RoleId...");
        if (userData.RoleId === 1) {
          console.log("👑 Admin detected. Navigating to /admin-dashboard");
          navigate("/admin-dashboard");
        } else {
          console.log("👤 Regular user detected. Navigating to /");
          navigate("/");
        }
      } else {
        console.error("❌ Invalid response from server:", response);
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <main>
      <div className="login-container">
        <h3><b>Login</b></h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Forgot Password Link */}
            <a
              href="#"
              className="forgot-password"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </main>
  );
};

export default Login;
