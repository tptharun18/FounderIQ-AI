import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import CreateDeal from "./pages/CreateDeal";
import AICopilot from "./pages/AICopilot";
import Briefing from "./pages/Briefing";
import SecurityLogs from "./pages/SecurityLogs";
import WorkOrders from "./pages/WorkOrders";
import Login from "./pages/Login";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="deals" element={<Deals />} />
        <Route path="create-deal" element={<CreateDeal />} />
        <Route path="ai-copilot" element={<AICopilot />} />
        <Route path="briefing" element={<Briefing />} />
        <Route path="security" element={<SecurityLogs />} />
        <Route path="work-orders" element={<WorkOrders />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Redirect all unknown URLs to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;