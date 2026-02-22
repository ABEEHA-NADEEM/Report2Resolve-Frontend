import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"
import apiFetch from "../api"

export default function Auth() {

  const [isSignup, setIsSignup] = useState(false)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone]       = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError(null)

    if (!email.trim() || !password.trim()) return setError("Email and password are required.")
    if (isSignup && !fullName.trim())      return setError("Full name is required.")

    setLoading(true)
    try {

      if (isSignup) {
        const data = await apiFetch("/signup", {
          method: "POST",
          body: JSON.stringify({ full_name: fullName, email, phone, password }),
        })
        if (data.error) return setError(data.error)
        localStorage.setItem("user", JSON.stringify(data))
        navigate("/dashboard")   // ✅ signed up → dashboard

      } else {
        const data = await apiFetch("/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        if (data.error) return setError(data.error)
        localStorage.setItem("user", JSON.stringify(data))
        navigate("/dashboard")   // ✅ logged in → dashboard
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

        {error && (
          <p style={{ color: "#e53e3e", marginBottom: 10, fontSize: 14 }}>{error}</p>
        )}

        {isSignup && (
          <>
            <input className="input" placeholder="Full Name"
              value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            <input className="input" placeholder="Phone (optional)"
              value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </>
        )}

        <input className="input" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}/>

        <input className="input" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}/>

        {!isSignup && <p className="forgot">Forgot Password?</p>}

        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </button>

        <p className="switch-auth">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setIsSignup(!isSignup); setError(null) }}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>

      <p className="or">or</p>

      {/* ✅ guest → home screen (not dashboard) */}
      <button className="guest-btn" onClick={() => navigate("/home")}>
        Continue as Guest
      </button>

    </div>
  )
}