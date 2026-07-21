import {
  FaHandshake,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

function StatCard({ title, value }) {
  let icon = <FaHandshake size={28} />;
  let color = "#2563eb";

  if (title === "Deal Owners") {
    icon = <FaUsers size={28} />;
    color = "#16a34a";
  }

  if (title === "Pipeline Stages") {
    icon = <FaChartLine size={28} />;
    color = "#ea580c";
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        flex: 1,
        minWidth: "240px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "0.3s",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            fontSize: "32px",
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          background: color,
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;