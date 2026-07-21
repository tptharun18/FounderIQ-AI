import {
  FaChartBar,
  FaHandshake,
  FaPlus,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItem = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 18px",
    marginBottom: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    textDecoration: "none",
    color: active ? "white" : "#d1d5db",
    background: active ? "#2563eb" : "transparent",
  });

  return (
    <div
      style={{
        width: "240px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        FounderIQ AI
      </h2>

      <Link
        to="/"
        style={menuItem(location.pathname === "/")}
      >
        <FaChartBar />
        Dashboard
      </Link>

      <Link
        to="/deals"
        style={menuItem(location.pathname === "/deals")}
      >
        <FaHandshake />
        Deals
      </Link>

      <Link
        to="/create-deal"
        style={menuItem(location.pathname === "/create-deal")}
      >
        <FaPlus />
        Create Deal
      </Link>
    </div>
  );
}

export default Sidebar;