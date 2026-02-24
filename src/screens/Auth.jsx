import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"
import apiFetch from "../api"

const DEPARTMENTS = [
  { id: "c855ff02-8c2a-49fc-a36c-931a2fec6cfa", name: "Public Works" },
  { id: "31e8c7d4-22e0-45fa-8c2b-5550661298f5", name: "Water & Sanitation" },
  { id: "656c4e54-9b64-450d-b950-8cad0ae808e1", name: "Electricity" },
  { id: "90692403-7e82-4ab5-b48e-a2a46a576371", name: "Parks & Recreation" },
  { id: "0f2b2384-2b07-44bf-8ed9-96d6cbb7aeb5", name: "Health & Safety" },
  { id: "4c2f96c6-8581-48e2-acce-d4d9c8e46855", name: "IT Department" },
  { id: "95607350-94d4-4d13-ab25-dc45afea0eec", name: "Cleanliness" },
]

export default function Auth() {
  const [mode, setMode]         = useState("login")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone]       = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [deptId, setDeptId]     = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(null)

  const navigate = useNavigate()

  const reset = () => {
    setFullName(""); setPhone(""); setEmail("")
    setPassword(""); setDeptId(""); setError(null); setSuccess(null)
  }

  const switchMode = (newMode) => { reset(); setMode(newMode) }

  const redirectByRole = (role) => {
    if (role === "admin")           navigate("/admin-dashboard")
    else if (role === "department") navigate("/dept-dashboard")
    else                            navigate("/dashboard")
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!email.trim() || !password.trim())
      return setError("Email and password are required.")
    if (mode !== "login" && !fullName.trim())
      return setError("Full name is required.")
    if (mode === "dept-signup" && !deptId)
      return setError("Please select your department.")

    setLoading(true)
    try {

      // ── LOGIN ──
      if (mode === "login") {
        const data = await apiFetch("/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        if (data.error) return setError(data.error)
        localStorage.setItem("user", JSON.stringify(data))
        redirectByRole(data.role)
      }

      // ── CITIZEN SIGNUP ──
      else if (mode === "citizen-signup") {
        const data = await apiFetch("/signup", {
          method: "POST",
          body: JSON.stringify({ full_name: fullName, email, phone, password }),
        })
        if (data.error) return setError(data.error)
        localStorage.setItem("user", JSON.stringify(data))
        redirectByRole(data.role)
      }

      // ── DEPARTMENT SIGNUP ──
      else if (mode === "dept-signup") {
        const data = await apiFetch("/dept-signup", {
          method: "POST",
          body: JSON.stringify({
            full_name:     fullName,
            email,
            password,
            department_id: deptId,
          }),
        })
        if (data.error) return setError(data.error)
        setSuccess("Request sent! Wait for admin approval before logging in.")
        reset()
      }

    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <img src={logo} alt="logo" className="onboard-logo"/>
      <h1 className="logo">Report2Resolve</h1>
      <p className="tagline">Your issues, our priority</p>

      <div className="auth-card">

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["login", "citizen-signup", "dept-signup"].map((m) => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
              cursor: "pointer", fontWeight: 600,
              background: mode === m ? "#3b82f6" : "#f0f0f0",
              color:      mode === m ? "#fff"    : "#333",
            }}>
              {m === "login" ? "Login" : m === "citizen-signup" ? "Citizen" : "Department"}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "#888", marginBottom: 12, textAlign: "center" }}>
          {mode === "login"          && "Login to your account"}
          {mode === "citizen-signup" && "Create a citizen account"}
          {mode === "dept-signup"    && "Register as department staff — admin will approve"}
        </p>

        {error   && <p style={{ color: "#e53e3e", marginBottom: 10, fontSize: 14 }}>{error}</p>}
        {success && <p style={{ color: "#38a169", marginBottom: 10, fontSize: 14 }}>{success}</p>}

        {mode !== "login" && (
          <input className="input" placeholder="Full Name"
            value={fullName} onChange={(e) => setFullName(e.target.value)}/>
        )}

        {mode === "citizen-signup" && (
          <input className="input" placeholder="Phone (optional)"
            value={phone} onChange={(e) => setPhone(e.target.value)}/>
        )}

        {mode === "dept-signup" && (
          <select className="input" value={deptId}
            onChange={(e) => setDeptId(e.target.value)}>
            <option value="">Select Your Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}

        <input className="input" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}/>

        <input className="input" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}/>

        {mode === "login" && <p className="forgot">Forgot Password?</p>}

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"          ? "Login"
            : mode === "citizen-signup" ? "Create Account"
            :                            "Request Access"
          }
        </button>

      </div>

      <p className="or">or</p>
      <button className="guest-btn" onClick={() => navigate("/home")}>
        Continue as Guest
      </button>
    </div>
  )
}