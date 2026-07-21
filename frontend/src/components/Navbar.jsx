import { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    "🔔 Live sync completed with Monday.com board.",
    "🔔 New deal 'Naruto' added to Sales Pipeline.",
    "🔔 Work order SDPLDEAL-075 status updated to Completed.",
    "🔔 System WAF checklist rate checking passed.",
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const username = localStorage.getItem("username") || "user333";
  const role = localStorage.getItem("role") || "Executive Administrator";

  return (
    <div
      style={{
        height: "70px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        position: "relative",
        zIndex: 100,
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#1f2937",
        }}
      >
        Executive Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          color: "#4b5563",
          position: "relative",
        }}
      >
        {/* Notification Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <FaBell
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            size={24}
          />
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                right: "0",
                width: "320px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid #e5e7eb",
                padding: "15px",
                fontSize: "14px",
                color: "#1f2937",
                zIndex: 101,
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                Notifications
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {notifications.map((note, idx) => (
                  <div key={idx} style={{ paddingBottom: "5px", borderBottom: "1px solid #f3f4f6" }}>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <FaUserCircle
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            size={30}
          />
          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                right: "0",
                width: "220px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid #e5e7eb",
                padding: "15px",
                fontSize: "14px",
                color: "#1f2937",
                zIndex: 101,
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", color: "#111827" }}>{username}</h4>
              <p style={{ margin: "0 0 15px 0", color: "#6b7280", fontSize: "12px" }}>{role}</p>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;