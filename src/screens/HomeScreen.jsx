import { useNavigate } from "react-router-dom"
import "../styles/global.css"
import logo from "../assets/logo.png"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">


      {/* Header */}
      <header className="home-header">
        <img src={logo} alt="Report2Resolve Logo" className="home-logo" />
          
        <nav className="nav-links">
          <button className="nav-btn secondary" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-btn secondary" onClick={() => navigate("/signup")}>Sign Up</button>
        </nav>
    </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Report2Resolve</h1>
        <p>
          Efficiently report issues, track their resolution, and stay informed on updates.
          Join us to make your reporting seamless and professional.
        </p>
        <div className="cta-buttons">
          <button className="primary-btn" onClick={() => navigate("/report")}>
            Report an Issue
          </button>
          <button className="secondary-btn" onClick={() => navigate("/issues")}>
            Browse Issues
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <h2>12</h2>
          <p>Reported</p>
        </div>
        <div className="stat-card">
          <h2>5</h2>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h2>7</h2>
          <p>Resolved</p>
        </div>
      </section>
    </div>
  )
}
