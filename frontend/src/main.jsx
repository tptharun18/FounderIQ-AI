import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import CreateDeal from "./pages/CreateDeal";

function App() {
  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/create-deal" element={<CreateDeal />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;