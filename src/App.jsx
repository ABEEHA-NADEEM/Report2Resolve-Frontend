import { Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Onboarding from "./screens/Onboarding"
import HomeScreen from "./screens/HomeScreen"
import ReportIssue from "./screens/ReportIssue"
import Dashboard from "./screens/dashboard.jsx"
import Auth from "./screens/Auth"


function App() {

useEffect(() => {
  fetch("/api/")          // ✅ was: "http://127.0.0.1:8000/"
    .then((res) => res.json())
    .then((data) => console.log("✅ FastAPI Connected:", data))
    .catch((err) => console.error("❌ FastAPI Failed:", err));
}, []);
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/report" element={<ReportIssue />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App