import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"
import { FaSignOutAlt, FaCheck, FaTimes, FaUsers, FaExclamationCircle } from "react-icons/fa"
import apiFetch from "../api"

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const admin     = JSON.parse(localStorage.getItem("user"))

  const [tab, setTab]               = useState("approvals")  // "approvals" | "issues"
  const [pending, setPending]       = useState([])
  const [issues, setIssues]         = useState([])
  const [loadingId, setLoadingId]   = useState(null)
  const [message, setMessage]       = useState(null)

  // ── Guard: only admin can access ──
  useEffect(() => {
    if (!admin || admin.role !== "admin") {
      navigate("/auth")
    }
  }, [])

  // ── Load pending approvals ──
  useEffect(() => {
    if (tab === "approvals") loadPending()
    if (tab === "issues")    loadIssues()
  }, [tab])

  const loadPending = async () => {
    try {
      const data = await apiFetch("/admin/pending-approvals")
      setPending(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  const loadIssues = async () => {
    try {
      const data = await apiFetch("/admin/all-issues")
      setIssues(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleApprove = async (userId) => {
    setLoadingId(userId)
    try {
      const data = await apiFetch(`/admin/approve/${userId}`, { method: "POST" })
      if (data.ok) {
        setMessage({ type: "success", text: "User approved successfully." })
        loadPending()
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to approve." })
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (userId) => {
    setLoadingId(userId)
    try {
      const data = await apiFetch(`/admin/reject/${userId}`, { method: "DELETE" })
      if (data.ok) {
        setMessage({ type: "success", text: "User rejected and removed." })
        loadPending()
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to reject." })
    } finally {
      setLoadingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/auth")
  }

  const statusColor = (status) => {
    if (!status) return "#888"
    const s = status.toLowerCase()
    if (s === "new")         return "#3b82f6"
    if (s === "in progress") return "#f59e0b"
    if (s === "resolved")    return "#10b981"
    if (s === "rejected")    return "#ef4444"
    return "#888"
  }

  return (
    <div className="dashboard" style={{ maxWidth: 700, margin: "0 auto" }}>

      {/* Header */}
      <header className="dash-header">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h2>Admin Panel</h2>
        </div>
        <div className="header-actions">
          <span style={{ fontSize: 13, color: "#888", marginRight: 12 }}>
            {admin?.name}
          </span>
          <div className="icon-btn logout-icon" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt />
          </div>
        </div>
      </header>

      {/* Feedback */}
      {message && (
        <p style={{
          color: message.type === "error" ? "#e53e3e" : "#38a169",
          padding: "10px 16px", marginBottom: 12,
          background: message.type === "error" ? "#fff5f5" : "#f0fff4",
          borderRadius: 8, fontSize: 14
        }}>
          {message.text}
        </p>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab("approvals")} style={{
          flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
          cursor: "pointer", fontWeight: 600,
          background: tab === "approvals" ? "#3b82f6" : "#f0f0f0",
          color: tab === "approvals" ? "#fff" : "#333",
        }}>
          <FaUsers style={{ marginRight: 6 }}/>
          Pending Approvals {pending.length > 0 && `(${pending.length})`}
        </button>

        <button onClick={() => setTab("issues")} style={{
          flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
          cursor: "pointer", fontWeight: 600,
          background: tab === "issues" ? "#3b82f6" : "#f0f0f0",
          color: tab === "issues" ? "#fff" : "#333",
        }}>
          <FaExclamationCircle style={{ marginRight: 6 }}/>
          All Issues
        </button>
      </div>

      {/* ── PENDING APPROVALS TAB ── */}
      {tab === "approvals" && (
        <section>
          <h3 style={{ marginBottom: 12 }}>Department Signup Requests</h3>

          {pending.length === 0 ? (
            <div style={{
              textAlign: "center", padding: 40, background: "#f9f9f9",
              borderRadius: 12, color: "#888"
            }}>
              <p>No pending approvals 🎉</p>
            </div>
          ) : (
            pending.map((user) => (
              <div key={user.user_id} style={{
                background: "#fff", borderRadius: 12, padding: 16,
                marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <h4 style={{ margin: 0 }}>{user.full_name}</h4>
                  <p style={{ margin: "4px 0", fontSize: 13, color: "#666" }}>{user.email}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                    Requested: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleApprove(user.user_id)}
                    disabled={loadingId === user.user_id}
                    style={{
                      background: "#10b981", color: "#fff", border: "none",
                      borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4, fontWeight: 600
                    }}
                  >
                    <FaCheck /> Approve
                  </button>

                  <button
                    onClick={() => handleReject(user.user_id)}
                    disabled={loadingId === user.user_id}
                    style={{
                      background: "#ef4444", color: "#fff", border: "none",
                      borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4, fontWeight: 600
                    }}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── ALL ISSUES TAB ── */}
      {tab === "issues" && (
        <section>
          <h3 style={{ marginBottom: 12 }}>All Reported Issues</h3>

          {issues.length === 0 ? (
            <div style={{
              textAlign: "center", padding: 40, background: "#f9f9f9",
              borderRadius: 12, color: "#888"
            }}>
              <p>No issues reported yet.</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.issue_id} style={{
                background: "#fff", borderRadius: 12, padding: 16,
                marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{issue.title}</h4>
                    <p style={{ margin: "4px 0", fontSize: 13, color: "#666" }}>
                      {issue.description}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: 12, color: "#aaa" }}>
                      {new Date(issue.created_at).toLocaleDateString()}
                      {" · "}
                      {issue.user_id ? "Registered User" : "Guest"}
                    </p>
                  </div>
                  <span style={{
                    background: statusColor(issue.issue_status?.status_name),
                    color: "#fff", borderRadius: 20, padding: "4px 12px",
                    fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
                  }}>
                    {issue.issue_status?.status_name || "Unknown"}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      )}

    </div>
  )
}