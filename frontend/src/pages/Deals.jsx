import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");

      setDeals(response.data.deals || []);
    } catch (error) {
      console.error("Error loading deals:", error);
      alert("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>Deals</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={loadDeals}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>

          <Link to="/create-deal">
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              + Create Deal
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <h2>Loading deals...</h2>
      ) : deals.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>No Deals Found</h3>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "#2563eb",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ padding: "14px" }}>Name</th>
                <th style={{ padding: "14px" }}>Owner</th>
                <th style={{ padding: "14px" }}>Status</th>
                <th style={{ padding: "14px" }}>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  style={{
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "14px" }}>
                    {deal.name}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {deal.owner || "-"}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {deal.status || "-"}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {deal.dueDate || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Deals;