function RecentActivity({ deals }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Recent Activity
      </h2>

      {deals.slice(0, 5).map((deal) => (
        <div
          key={deal.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
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
              background: "#2563eb",
              color: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              height: "fit-content",
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