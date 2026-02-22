import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">

      <header className="home-header">
        <img src={logo} alt="Report2Resolve Logo" className="home-logo" />
        <nav className="nav-links">
          {/* ✅ both go to /auth */}
          <button className="nav-btn secondary" onClick={() => navigate("/auth")}>Login</button>
          <button className="nav-btn secondary" onClick={() => navigate("/auth")}>Sign Up</button>
        </nav>
      </header>

      <section className="hero-section">
        <h1>Welcome to Report2Resolve</h1>
        <p>
          Efficiently report issues, track their resolution, and stay informed on updates.
          Join us to make your reporting seamless and professional.
        </p>
        <div className="cta-buttons">
          {/* ✅ guest can report — user_id will be null */}
          <button className="primary-btn" onClick={() => navigate("/report")}>
            Report an Issue
          </button>
          <button className="secondary-btn" onClick={() => navigate("/auth")}>
            Login / Sign Up
          </button>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card"><h2>12</h2><p>Reported</p></div>
        <div className="stat-card"><h2>5</h2><p>In Progress</p></div>
        <div className="stat-card"><h2>7</h2><p>Resolved</p></div>
      </section>

    </div>
  )
}