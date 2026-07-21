import { useState } from "react";
import api from "../services/api";

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const hash = await sha256(password);
      const res = await api.post("/auth/login", {
        username,
        password_hash: hash,
      });

      if (res.data.success) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("role", res.data.user.role);
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#111827" }}>FounderIQ AI</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "30px" }}>
          Executive Intelligence Portal
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
              }}
              placeholder="user333"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
              }}
              placeholder="skylark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            background: "#eff6ff",
            padding: "14px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#1e40af",
            border: "1px solid #bfdbfe",
          }}
        >
          <strong>🔑 Access Note:</strong>
          <br />
          Username: <code style={{ fontWeight: "bold" }}>user333</code>
          <br />
          Password: <code style={{ fontWeight: "bold" }}>skylark</code>
        </div>
      </div>
    </div>
  );
}

export default Login;
