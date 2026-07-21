import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import StatCard from "../components/StatCard";
import PipelineChart from "../components/PipelineChart";
import OwnerChart from "../components/OwnerChart";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalDeals: 0,
    deals: [],
    salesPipeline: {},
    dealOwners: {},
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [modalType, setModalType] = useState(null); // 'owners' | 'stages' | null

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = useMemo(() => {
    return (dashboard.deals || []).filter((deal) => {
      const nameMatch = (deal.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        deal.status === statusFilter;

      const sectorMatch =
        sectorFilter === "All" ||
        deal.sector === sectorFilter;

      return nameMatch && statusMatch && sectorMatch;
    });
  }, [dashboard, search, statusFilter, sectorFilter]);

  const uniqueSectors = useMemo(() => {
    const sectors = new Set((dashboard.deals || []).map((d) => d.sector).filter(Boolean));
    return ["All", ...Array.from(sectors)];
  }, [dashboard.deals]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 30 }}>
        FounderIQ AI Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <StatCard
          title="Total Deals"
          value={dashboard.totalDeals}
          onClick={() => navigate("/deals")}
        />

        <StatCard
          title="Deal Owners"
          value={Object.keys(dashboard.dealOwners || {}).length}
          onClick={() => setModalType("owners")}
        />

        <StatCard
          title="Pipeline Stages"
          value={Object.keys(dashboard.salesPipeline || {}).length}
          onClick={() => setModalType("stages")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <PipelineChart
          data={dashboard.salesPipeline || {}}
        />

        <OwnerChart
          data={dashboard.dealOwners || {}}
        />

        <RecentActivity
          deals={dashboard.deals || []}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            width: 220,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <option value="All">All Statuses</option>

          {Object.keys(dashboard.salesPipeline || {}).map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}
        </select>

        <select
          value={sectorFilter}
          onChange={(e) =>
            setSectorFilter(e.target.value)
          }
          style={{
            width: 220,
            padding: 12,
            borderRadius: 8,
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

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow:
            "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <h2>Deals</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px" }}>Item</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Value/Cost</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Deal Stage</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Sector</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Owner Code</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Status Value</th>
            </tr>
          </thead>

          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px", fontWeight: "600" }}>{deal.name}</td>
                <td style={{ padding: "10px" }}>
                  {isNaN(deal.deal_value) ? deal.deal_value : parseFloat(deal.deal_value).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0
                  })}
                </td>
                <td style={{ padding: "10px" }}>{deal.deal_stage || "-"}</td>
                <td style={{ padding: "10px" }}>{deal.sector || "-"}</td>
                <td style={{ padding: "10px" }}>{deal.owner || "-"}</td>
                <td style={{ padding: "10px" }}>
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

      {/* Distribution Modal */}
      {modalType && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalType(null)}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "450px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={() => setModalType(null)}
            >
              ✖
            </button>

            {modalType === "owners" ? (
              <>
                <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#111827" }}>
                  👥 Deal Owners Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {Object.entries(dashboard.dealOwners || {}).map(([owner, count]) => {
                    const pct = ((count / dashboard.totalDeals) * 100).toFixed(1);
                    return (
                      <div key={owner}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <span style={{ fontWeight: "600", color: "#374151" }}>{owner}</span>
                          <span style={{ color: "#6b7280" }}>{count} deals ({pct}%)</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#16a34a", borderRadius: "4px" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#111827" }}>
                  📈 Sales Pipeline Stages Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {Object.entries(dashboard.salesPipeline || {}).map(([stage, count]) => {
                    const pct = ((count / dashboard.totalDeals) * 100).toFixed(1);
                    return (
                      <div key={stage}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <span style={{ fontWeight: "600", color: "#374151" }}>{stage}</span>
                          <span style={{ color: "#6b7280" }}>{count} deals ({pct}%)</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#ea580c", borderRadius: "4px" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;