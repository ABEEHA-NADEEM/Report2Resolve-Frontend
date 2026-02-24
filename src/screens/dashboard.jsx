import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import logo from "../assets/logo.png";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { MdHome, MdAddCircle, MdDescription } from "react-icons/md";
import apiFetch from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { 
      navigate("/auth"); 
      return; 
    }
    loadIssues();
    
    // Reload issues every 10 seconds for real-time updates
    const interval = setInterval(() => {
      loadIssues();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadIssues = async () => {
    try {
      console.log("Fetching issues for user:", user.user_id);
      const data = await apiFetch(`/my-issues/${user.user_id}`);
      console.log("Received data:", data);
      
      if (data.error) {
        console.error("API Error:", data.error);
        setIssues([]);
      } else {
        setIssues(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Failed to load issues", e);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const getStatusType = (statusName) => {
    if (!statusName) return "unknown";
    const s = statusName.toLowerCase();
    
    // More specific matching
    if (s === "submitted" || s === "submit") return "submitted";
    if (s.includes("progress") || s === "in progress") return "progress";
    if (s === "resolved" || s.includes("complete")) return "resolved";
    if (s === "rejected" || s.includes("reject")) return "rejected";
    
    return "unknown";
  };

  const statusColor = (statusName) => {
    const type = getStatusType(statusName);
    
    switch(type) {
      case "submitted":  return "#3b82f6"; // Blue
      case "progress":   return "#f59e0b"; // Orange/Yellow
      case "resolved":   return "#10b981"; // Green
      case "rejected":   return "#ef4444"; // Red
      default:           return "#888";    // Gray
    }
  };

  const badgeClass = (statusName) => {
    const type = getStatusType(statusName);
    return `badge ${type}`;
  };

  // Count issues by status type
  const submitted = issues.filter(i => 
    getStatusType(i.issue_status?.status_name) === "submitted"
  ).length;

  const inProgress = issues.filter(i => 
    getStatusType(i.issue_status?.status_name) === "progress"
  ).length;

  const resolved = issues.filter(i => 
    getStatusType(i.issue_status?.status_name) === "resolved"
  ).length;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h2>Report2Resolve</h2>
        </div>
        <div className="header-actions">
          <div className="icon-btn">
            <FaBell />
            {issues.length > 0 && <span className="notif-dot" />}
          </div>
          <div className="icon-btn logout-icon" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt />
          </div>
        </div>
      </header>

      <h3 className="welcome">Welcome, {user ? user.name : "Guest"} 👋</h3>

      {/* ── Stats ── */}
      <div className="stats">
        <div className="stat-card">
          <span className="dot red" />
          <h2>{submitted}</h2>
          <p>Submitted</p>
        </div>
        <div className="stat-card">
          <span className="dot yellow" />
          <h2>{inProgress}</h2>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <span className="dot green" />
          <h2>{resolved}</h2>
          <p>Resolved</p>
        </div>
      </div>

      <button className="report-btn" onClick={() => navigate("/report")}>
        <h4>📷 Report an Issue</h4>
      </button>

      {/* ── Recent Activity ── */}
      <section className="activity">
        <h3>Recent Activity</h3>

        {loading ? (
          <p style={{ color: "#888", textAlign: "center", padding: 20 }}>Loading...</p>

        ) : issues.length === 0 ? (
          <div style={{
            textAlign: "center", padding: 30,
            background: "#f9f9f9", borderRadius: 12, color: "#888"
          }}>
            <p>No issues reported yet. Tap the button above to report one!</p>
          </div>

        ) : (
          issues.map((issue) => (
            <div className="activity-card" key={issue.issue_id}>
              <div className="left">
                <div>
                  <h4>{issue.title}</h4>
                  <p style={{ fontSize: 13, color: "#666" }}>{issue.description}</p>
                  <small>{new Date(issue.created_at).toLocaleDateString()}</small>
                </div>
              </div>
              <span
                className={badgeClass(issue.issue_status?.status_name)}
                style={{ background: statusColor(issue.issue_status?.status_name) }}
              >
                {issue.issue_status?.status_name || "Unknown"}
              </span>
            </div>
          ))
        )}
      </section>

      <nav className="bottom-nav">
        <span className="active"><MdHome /></span>
        <button className="add" onClick={() => navigate("/report")}><MdAddCircle /></button>
        <span onClick={() => navigate("/reports")}><MdDescription /></span>
      </nav>
    </div>
  );
}