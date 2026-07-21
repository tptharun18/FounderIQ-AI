import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function CreateDeal() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("No Status");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a deal name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/deals", {
        name,
        status,
        dueDate,
      });
      alert("Deal created successfully!");
      navigate("/deals");
    } catch (error) {
      console.error("Error creating deal:", error);
      alert("Failed to create deal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>Create Deal</h1>
        <Link to="/deals">
          <button
            style={{
              background: "#6b7280",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Deals
          </button>
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="deal-name"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              Deal Name
            </label>
            <input
              id="deal-name"
              type="text"
              placeholder="Enter deal name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="deal-status"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              Status
            </label>
            <select
              id="deal-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                background: "#fff",
              }}
            >
              <option value="No Status">No Status</option>
              <option value="Prospect">Prospect</option>
              <option value="In Progress">In Progress</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              htmlFor="deal-due-date"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              Due Date
            </label>
            <input
              id="deal-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Creating..." : "Save Deal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDeal;