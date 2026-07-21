import { useEffect, useState } from "react";
import api from "../services/api";

function Briefing() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    try {
      setLoading(true);
      const response = await api.post("/leadership-update");
      setBriefing(response.data.markdown || "No briefing available.");
    } catch (error) {
      console.error("Briefing Error:", error);
      setBriefing("⚠️ Failed to load Executive Leadership Briefing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(briefing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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
        <h1 style={{ margin: 0 }}>Leadership Briefing</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchBriefing}
            style={{
              background: "#6b7280",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🔄 Regenerate
          </button>
          <button
            onClick={handleCopy}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Markdown"}
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🖨️ Print / Export PDF
          </button>
        </div>
      </div>

      <div
        className="printable-briefing"
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          color: "#1f2937",
        }}
      >
        {loading ? <h2>Generating Executive Briefing...</h2> : briefing}
      </div>
    </div>
  );
}

export default Briefing;
