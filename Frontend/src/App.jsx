import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tasks from "./pages/Tasks";
import AssetDetails from "./pages/AssetDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/assets/:assetId" element={<AssetDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
