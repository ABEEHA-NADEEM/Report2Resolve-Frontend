import { Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Onboarding from "./screens/Onboarding"
import HomeScreen from "./screens/HomeScreen"
import ReportIssue from "./screens/ReportIssue"
import Dashboard from "./screens/dashboard.jsx"
import Auth from "./screens/Auth"
import AdminDashboard from "./screens/AdminDashboard"
import DeptDashboard from "./screens/DeptDashboard"

function App() {
  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => console.log("✅ FastAPI Connected:", data))
      .catch((err) => console.error("❌ FastAPI Failed:", err))
  }, [])

  return (
    <Routes>
      <Route path="/"                element={<Onboarding />} />
      <Route path="/home"            element={<HomeScreen />} />
      <Route path="/auth"            element={<Auth />} />
      <Route path="/report"          element={<ReportIssue />} />
      <Route path="/dashboard"       element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/dept-dashboard"  element={<DeptDashboard />} />
    </Routes>
  )
}

export default App