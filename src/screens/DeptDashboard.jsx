import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"
import { FaSignOutAlt } from "react-icons/fa"
import { MdHome, MdDescription, MdClose } from "react-icons/md"
import apiFetch from "../api"

export default function DeptDashboard() {
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem("user"))

  const [tab, setTab]           = useState("active")
  const [issues, setIssues]     = useState([])
  const [allIssues, setAllIssues] = useState([])  // for stats
  const [statuses, setStatuses] = useState({})
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState(null)
  const [message, setMessage]   = useState(null)

  // ── Guard ──
  useEffect(() => {
    if (!user || user.role !== "department") {
      navigate("/auth")
      return
    }
    loadStatuses()
    loadAllIssues()
  }, [])

  useEffect(() => {
    if (user?.department_id) loadIssues()
  }, [tab])

  // Load status UUIDs
  const loadStatuses = async () => {
    try {
      const data = await apiFetch("/statuses")
      const map  = {}
      data.forEach((s) => {
        map[s.status_name.toLowerCase()] = s.status_id
      })
      setStatuses(map)
    } catch (e) {
      console.error("Failed to load statuses", e)
    }
  }

  // Load ALL issues for stats count
  const loadAllIssues = async () => {
    try {
      const active   = await apiFetch(`/dept/issues/${user.department_id}?tab=active`)
      const resolved = await apiFetch(`/dept/issues/${user.department_id}?tab=resolved`)
      const rejected = await apiFetch(`/dept/issues/${user.department_id}?tab=rejected`)
      setAllIssues({
        active:   Array.isArray(active)   ? active.length   : 0,
        resolved: Array.isArray(resolved) ? resolved.length : 0,
        rejected: Array.isArray(rejected) ? rejected.length : 0,
      })
    } catch (e) {
      console.error(e)
    }
  }

  // Load issues for current tab
  const loadIssues = async () => {
    setLoading(true)
    try {
      const data = await apiFetch(
        `/dept/issues/${user.department_id}?tab=${tab}`
      )
      setIssues(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Update issue status
  const updateStatus = async (issueId, statusId) => {
    if (!statusId) return setMessage({ type: "error", text: "Status not found." })
    setUpdating(issueId)
    setMessage(null)
    try {
      const data = await apiFetch(`/dept/update-status/${issueId}`, {
        method: "POST",
        body: JSON.stringify({
          status_id:  statusId,
          updated_by: user.user_id,
          remarks:    "Status updated by department",
        }),
      })
      if (data.ok) {
        setMessage({ type: "success", text: "Status updated successfully." })
        loadIssues()
        loadAllIssues()  // refresh stats
      } else {
        setMessage({ type: "error", text: data.error || "Update failed." })
      }
    } catch (e) {
      setMessage({ type: "error", text: "Update failed." })
    } finally {
      setUpdating(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/auth")
  }

  const statusColor = (name) => {
    if (!name) return "#888"
    const s = name.toLowerCase()
    if (s.includes("submit"))   return "#3b82f6"
    if (s.includes("progress")) return "#f59e0b"
    if (s.includes("resolved")) return "#10b981"
    if (s.includes("rejected")) return "#ef4444"
    return "#888"
  }

  const tabs = [
    { key: "active",   label: "Active",   color: "#3b82f6" },
    { key: "resolved", label: "Resolved", color: "#10b981" },
    { key: "rejected", label: "Rejected", color: "#ef4444" },
  ]

  return (
    <div className="dashboard" style={{ maxWidth: 700, margin: "0 auto" }}>

      {/* ── Header ── */}
      <header className="dash-header">
        <div className="brand">
          <img src={logo} alt="logo"/>
          <h2>Department Portal</h2>
        </div>
        <div className="header-actions">
          <span style={{ fontSize: 13, color: "#888", marginRight: 12 }}>
            {user?.name}
          </span>
          <div className="icon-btn logout-icon" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt />
          </div>
        </div>
      </header>

      <h3 className="welcome">Welcome, {user?.name} 👋</h3>

      {/* ── Stats ── */}
      <div className="stats">
        <div className="stat-card" onClick={() => setTab("active")}
          style={{ cursor: "pointer" }}>
          <span className="dot yellow"/>
          <h2>{allIssues.active || 0}</h2>
          <p>Active</p>
        </div>
        <div className="stat-card" onClick={() => setTab("resolved")}
          style={{ cursor: "pointer" }}>
          <span className="dot green"/>
          <h2>{allIssues.resolved || 0}</h2>
          <p>Resolved</p>
        </div>
        <div className="stat-card" onClick={() => setTab("rejected")}
          style={{ cursor: "pointer" }}>
          <span className="dot red"/>
          <h2>{allIssues.rejected || 0}</h2>
          <p>Rejected</p>
        </div>
      </div>

      {/* ── Feedback ── */}
      {message && (
        <p style={{
          color:      message.type === "error" ? "#e53e3e" : "#38a169",
          background: message.type === "error" ? "#fff5f5" : "#f0fff4",
          padding: "10px 16px", borderRadius: 8,
          fontSize: 14, marginBottom: 12
        }}>
          {message.text}
        </p>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
            cursor: "pointer", fontWeight: 600,
            background: tab === t.key ? t.color : "#f0f0f0",
            color:      tab === t.key ? "#fff"   : "#333",
          }}>
            {t.label}
            {t.key === "active"   && allIssues.active   > 0 && ` (${allIssues.active})`}
            {t.key === "resolved" && allIssues.resolved  > 0 && ` (${allIssues.resolved})`}
            {t.key === "rejected" && allIssues.rejected  > 0 && ` (${allIssues.rejected})`}
          </button>
        ))}
      </div>

      {/* ── Issues List ── */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>Loading...</p>

      ) : issues.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 40,
          background: "#f9f9f9", borderRadius: 12, color: "#888"
        }}>
          <p>
            {tab === "resolved" ? "No resolved issues yet." :
             tab === "rejected" ? "No rejected issues." :
             "No active issues 🎉"}
          </p>
        </div>

      ) : (
        issues.map((issue) => (
          <div key={issue.issue_id} style={{
            background: "#fff", borderRadius: 12, padding: 16,
            marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            borderLeft: `4px solid ${statusColor(issue.issue_status?.status_name)}`
          }}>

            {/* ── Issue Info ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{issue.title}</h4>
                <p style={{ margin: "4px 0", fontSize: 13, color: "#666" }}>
                  {issue.description}
                </p>
                <p style={{ margin: "4px 0", fontSize: 12, color: "#aaa" }}>
                  📅 {new Date(issue.created_at).toLocaleDateString()}
                  {" · "}
                  {issue.user_id ? "👤 Registered User" : "👤 Guest"}
                </p>
              </div>

              <span style={{
                background:   statusColor(issue.issue_status?.status_name),
                color:        "#fff",
                borderRadius: 20,
                padding:      "4px 12px",
                fontSize:     12,
                fontWeight:   600,
                whiteSpace:   "nowrap",
                marginLeft:   8,
              }}>
                {issue.issue_status?.status_name || "Unknown"}
              </span>
            </div>

            {/* ── Action Buttons (active issues only) ── */}
            {tab === "active" && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => updateStatus(issue.issue_id, statuses["in progress"])}
                  disabled={updating === issue.issue_id}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                    background: updating === issue.issue_id ? "#ccc" : "#f59e0b",
                    color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13
                  }}
                >
                  {updating === issue.issue_id ? "..." : "⏳ In Progress"}
                </button>

                <button
                  onClick={() => updateStatus(issue.issue_id, statuses["resolved"])}
                  disabled={updating === issue.issue_id}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                    background: updating === issue.issue_id ? "#ccc" : "#10b981",
                    color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13
                  }}
                >
                  {updating === issue.issue_id ? "..." : "✅ Resolve"}
                </button>

                <button
                  onClick={() => updateStatus(issue.issue_id, statuses["rejected"])}
                  disabled={updating === issue.issue_id}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                    background: updating === issue.issue_id ? "#ccc" : "#ef4444",
                    color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13
                  }}
                >
                  {updating === issue.issue_id ? "..." : "❌ Reject"}
                </button>
              </div>
            )}

          </div>
        ))
      )}

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <span className="active"><MdHome /></span>
        <span onClick={() => setTab("resolved")}><MdDescription /></span>
        <span onClick={() => setTab("rejected")}><MdClose /></span>
      </nav>

    </div>
  )
}