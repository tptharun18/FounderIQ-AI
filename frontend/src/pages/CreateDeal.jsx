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
      const response = await api.get("/dashboard");
      setDeals(response.data.deals || []);
    } catch (error) {
      console.error(error);
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
          marginBottom: "30px",
        }}
      >
        <h1>Deals</h1>

        <Link to="/create-deal">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            + Create Deal
          </button>
        </Link>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
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
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.name}</td>
                <td>{deal.owner || "-"}</td>
                <td>{deal.status || "-"}</td>
                <td>{deal.dueDate || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Deals;