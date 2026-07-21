import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");

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

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const nameMatch = (deal.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || deal.status === statusFilter;

      const sectorMatch =
        sectorFilter === "All" || deal.sector === sectorFilter;

      return nameMatch && statusMatch && sectorMatch;
    });
  }, [deals, search, statusFilter, sectorFilter]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(deals.map((d) => d.status).filter(Boolean));
    return ["All", ...Array.from(statuses)];
  }, [deals]);

  const uniqueSectors = useMemo(() => {
    const sectors = new Set(deals.map((d) => d.sector).filter(Boolean));
    return ["All", ...Array.from(sectors)];
  }, [deals]);

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

      {/* Search and Filters Bar */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            width: "220px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="All">All Statuses</option>
          {uniqueStatuses.filter(s => s !== "All").map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          style={{
            width: "220px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          {uniqueSectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <h2>Loading deals...</h2>
      ) : filteredDeals.length === 0 ? (
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
              {filteredDeals.map((deal) => (
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