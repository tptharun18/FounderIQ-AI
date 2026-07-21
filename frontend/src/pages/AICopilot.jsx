import { useState, useRef, useEffect } from "react";
import api from "../services/api";

function AICopilot() {
  const [messages, setMessages] = useState([
    {
      sender: "agent",
      text: "Hello! I am FounderIQ AI, your Executive Intelligence Copilot. Ask me anything about your Monday.com Sales Pipeline (Deals) or Project Execution (Work Orders), or request a leadership report update.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) setInput("");

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      const response = await api.post("/chat", { message: query });
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "⚠️ Sorry, I encountered an error retrieving data from Monday.com or speaking with the LLM backend. Please check your credentials.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    {
      label: "📊 Sales Pipeline Overview",
      query: "Give me an overview of our sales pipeline/deals from Monday.com",
    },
    {
      label: "🏗️ Work Orders & Costs",
      query: "Check our work orders, statuses, and estimated costs",
    },
    {
      label: "📈 Executive Leadership Update",
      query: "Generate a leadership update report summarizing both pipeline and work order progress",
    },
    {
      label: "⚠️ Data Caveats & Caveats",
      query: "Are there any data quality issues, missing values, or caveats in our records?",
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>AI Copilot</h1>
      
      <div
        style={{
          display: "flex",
          gap: "20px",
          height: "calc(100vh - 180px)",
          minHeight: "450px",
        }}
      >
        {/* Chat Window */}
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: msg.sender === "user" ? "#2563eb" : "#f3f4f6",
                  color: msg.sender === "user" ? "white" : "#1f2937",
                  fontSize: "15px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                  boxShadow: "0 2px 5px rgba(0,0,0,.03)",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#e5e7eb",
                  color: "#4b5563",
                  fontSize: "14px",
                  fontStyle: "italic",
                }}
              >
                FounderIQ is thinking & querying Monday.com...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "15px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Ask a question about the deals or work orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "0 24px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              Ask
            </button>
          </form>
        </div>

        {/* Preset / Sidebar Suggestions Panel */}
        <div
          style={{
            width: "300px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <h3 style={{ margin: 0, color: "#1f2937" }}>Suggested Queries</h3>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Click any query below to run it against your Monday.com boards:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {presetQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                disabled={loading}
                style={{
                  textAlign: "left",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "13px",
                  color: "#374151",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICopilot;
