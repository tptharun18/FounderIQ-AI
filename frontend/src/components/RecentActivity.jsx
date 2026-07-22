function RecentActivity({ deals, onSelectDeal }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Recent Activity</h2>

      {deals.slice(0, 5).map((deal) => (
        <div
          key={deal.id}
          onClick={() => onSelectDeal && onSelectDeal(deal)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 10px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
            borderRadius: "6px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div>
            <strong>{deal.name}</strong>
            <br />
            <span
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {deal.owner}
            </span>
          </div>

          <span
            style={{
              background: deal.status === "Won" ? "#10b981" : deal.status === "Dead" ? "#ef4444" : "#2563eb",
              color: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              height: "fit-content",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {deal.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;