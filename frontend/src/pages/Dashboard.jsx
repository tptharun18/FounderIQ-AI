import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import StatCard from "../components/StatCard";
import PipelineChart from "../components/PipelineChart";
import OwnerChart from "../components/OwnerChart";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalDeals: 0,
    deals: [],
    salesPipeline: {},
    dealOwners: {},
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

      return nameMatch && statusMatch;
    });
  }, [dashboard, search, statusFilter]);

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
        />

        <StatCard
          title="Deal Owners"
          value={Object.keys(dashboard.dealOwners || {}).length}
        />

        <StatCard
          title="Pipeline Stages"
          value={Object.keys(dashboard.salesPipeline || {}).length}
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
          }}
        >
          <option value="All">All</option>

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
              <th>Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.name}</td>
                <td>{deal.owner || "-"}</td>
                <td>{deal.status || "-"}</td>
                <td>{deal.dueDate || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDeals.length === 0 && (
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
            }}
          >
            No deals found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;