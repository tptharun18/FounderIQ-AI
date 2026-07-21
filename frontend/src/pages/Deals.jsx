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
                <th style={{ padding: "14px", textAlign: "left" }}>Item</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Value/Cost</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Deal Stage</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Sector</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Owner Code</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Status Value</th>
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
                  <td style={{ padding: "14px", fontWeight: "600" }}>{deal.name}</td>
                  <td style={{ padding: "14px" }}>
                    {isNaN(deal.deal_value) ? deal.deal_value : parseFloat(deal.deal_value).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0
                    })}
                  </td>
                  <td style={{ padding: "14px" }}>{deal.deal_stage || "-"}</td>
                  <td style={{ padding: "14px" }}>{deal.sector || "-"}</td>
                  <td style={{ padding: "14px" }}>{deal.owner || "-"}</td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        background: deal.status === "Won" ? "#d1fae5" : deal.status === "Dead" ? "#fee2e2" : "#fef3c7",
                        color: deal.status === "Won" ? "#065f46" : deal.status === "Dead" ? "#991b1b" : "#92400e",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "12px"
                      }}
                    >
                      {deal.status || "-"}
                    </span>
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