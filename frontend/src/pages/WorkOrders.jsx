import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/work-orders");
      setWorkOrders(response.data.work_orders || []);
    } catch (error) {
      console.error("Error loading work orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return workOrders.filter((order) => {
      const nameMatch = (order.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusMatch =
        statusFilter === "All" || order.status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [workOrders, search, statusFilter]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(workOrders.map((o) => o.status).filter(Boolean));
    return ["All", ...Array.from(statuses)];
  }, [workOrders]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>Work Orders</h1>
        <button
          onClick={loadWorkOrders}
          style={{
            background: "#6b7280",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search projects..."
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
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <h2>Loading execution data...</h2>
      ) : filteredOrders.length === 0 ? (
        <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", textAlign: "center" }}>
          <h3>No Work Orders Found</h3>
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
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#1f2937", color: "#fff" }}>
              <tr>
                <th style={{ padding: "14px", textAlign: "left" }}>Project Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Customer Code</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Serial #</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Sector</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Execution Status</th>
                <th style={{ padding: "14px", textAlign: "right" }}>Billed Amount (₹)</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Personnel Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "14px", fontWeight: "600", color: "#1f2937" }}>{order.name}</td>
                  <td style={{ padding: "14px", color: "#4b5563" }}>{order.client_code}</td>
                  <td style={{ padding: "14px", color: "#4b5563" }}>{order.serial_num}</td>
                  <td style={{ padding: "14px", color: "#4b5563" }}>{order.sector}</td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        background: order.status.toLowerCase().includes("complete") ? "#d1fae5" : "#fee2e2",
                        color: order.status.toLowerCase().includes("complete") ? "#065f46" : "#991b1b",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "12px",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right", color: "#10b981", fontWeight: "bold" }}>
                    {parseFloat(order.billed_amount.replace(/[^0-9.]/g, "") || 0).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "14px", color: "#4b5563" }}>{order.personnel_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WorkOrders;
