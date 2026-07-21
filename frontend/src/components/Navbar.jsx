import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
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
          fontSize: "24px",
          color: "#4b5563",
        }}
      >
        <FaBell />
        <FaUserCircle size={32} />
      </div>
    </div>
  );
}

export default Navbar;