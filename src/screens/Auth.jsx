import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"
import apiFetch  from "../api";

export default function Auth() {

  const [isSignup, setIsSignup] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [anonymousAllowed, setAnonymousAllowed] = useState(true)

  const navigate = useNavigate()

  const handleSubmit = () => {

    if (!isSignup) {
      console.log("Login:", email)
      navigate("/dashboard")
    } else {
      console.log("Signup:", {
        full_name: fullName,
        email,
        phone,
        is_anonymous_allowed: anonymousAllowed
      })
      navigate("/dashboard")
    }
  }

  return (
    <div className="auth-container">

      <img src={logo} alt="logo" className="onboard-logo" />

      <h1 className="logo">Report2Resolve</h1>
      <p className="tagline">Your issues, our priority</p>

      <div className="auth-card">

        {/* SIGNUP ONLY */}
        {isSignup && (
          <>
            <input
              className="input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="input"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            
          </>
        )}

        {/* Email */}
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isSignup && (
          <p className="forgot">Forgot Password?</p>
        )}

        <button
          className="primary-btn"
          onClick={handleSubmit}
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        {/* Toggle text */}
        <p className="switch-auth">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>

      <p className="or">or</p>

      <button
        className="guest-btn"
        onClick={() => navigate("/home")}
      >
        Continue as Guest
      </button>

    </div>
  )
}
