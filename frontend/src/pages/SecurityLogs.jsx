import { useEffect, useState } from "react";
import api from "../services/api";

function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/security/audit");
      setLogs(response.data.audit_logs || []);
    } catch (error) {
      console.error("Security Logs Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 style={{ margin: 0 }}>Security & WAF Audit Logs</h1>
        <button
          onClick={fetchLogs}
          style={{
            background: "#6b7280",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Logs
        </button>
      </div>

      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
        OWASP WAF firewall details, clients pre-transmission SHA-256 verification hashes, and Monday.com API telemetry checksums.
      </p>

      {loading ? (
        <h2>Loading Audit Trail...</h2>
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
                background: "#1f2937",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ padding: "14px" }}>Timestamp</th>
                <th style={{ padding: "14px" }}>Event Type</th>
                <th style={{ padding: "14px" }}>Audit Details</th>
                <th style={{ padding: "14px" }}>SHA-256 Checksum</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "14px", color: "#374151" }}>{log.timestamp}</td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        background: log.event_type.includes("BLOCK") ? "#fef2f2" : "#f0fdf4",
                        color: log.event_type.includes("BLOCK") ? "#991b1b" : "#166534",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "12px",
                      }}
                    >
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ padding: "14px", color: "#4b5563" }}>{log.details}</td>
                  <td style={{ padding: "14px" }}>
                    <code style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#ef4444" }}>
                      {log.checksum.slice(0, 16)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SecurityLogs;
