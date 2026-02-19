import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import logo from "../assets/logo.png";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { MdHome, MdAddCircle, MdDescription } from "react-icons/md";


export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Header */}
    <header className="dash-header">
  <div className="brand">
    <img src={logo} alt="logo" />
    <h2>Report2Resolve</h2>
  </div>

  <div className="header-actions">
    <div className="icon-btn">
      <FaBell />
      <span className="notif-dot" />
    </div>

    <div
    className="icon-btn logout-icon"
    title="Logout"
    onClick={() => navigate("/auth")}
  >
    <FaSignOutAlt />
  </div>
  </div>
</header>


      <h3 className="welcome"></h3>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <span className="dot red" />
          <h2>1</h2>
          <p>New</p>
        </div>
        <div className="stat-card">
          <span className="dot yellow" />
          <h2>2</h2>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <span className="dot green" />
          <h2>0</h2>
          <p>Resolved</p>
        </div>
      </div>

      {/* Report Button */}
      <button className="report-btn" onClick={() => navigate("/report")}>
         <h4>📷     Report an Issue</h4>
      </button>

      {/* Quick Cards */}
      <div className="quick">
        <div className="quick-card " onClick={() => navigate("/reports")}>
          <h4><center>My Reports</center></h4>

        </div>

        {/* <div className="quick-card">
          <h4>Nearby Issues</h4>
          <p>Map view</p>
        </div> */}
      </div>

      {/* Recent Activity */}
      <section className="activity">
        <h3>Recent Activity</h3>

        <div className="activity-card">
          <div className="left">
            {/* <img src="https://via.placeholder.com/50" alt="" /> */}
            <div>
              <h4>Broken Street Light</h4>
              <p>Building A Entrance, Main Campus</p>
              <small>Jan 28</small>
            </div>
          </div>
          <span className="badge progress">In Progress</span>
        </div>

        <div className="activity-card">
          <div className="left">
            {/* <img src="https://via.placeholder.com/50" alt="" /> */}
            <div>
              <h4>Leaking Pipe in Restroom</h4>
              <p>2nd Floor, Building B</p>
              <small>Feb 1</small>
            </div>
          </div>
          <span className="badge new">New</span>
        </div>

        <div className="activity-card">
          <div className="left">
            {/* <img src="https://via.placeholder.com/50" alt="" /> */}
            <div>
              <h4>Overflowing Trash Bin</h4>
              <p>Cafeteria Area, Main Building</p>
              <small>Jan 29</small>
            </div>
          </div>
          <span className="badge resolved">Resolved</span>
        </div>
      </section>

      {/* Bottom Nav */}
 <nav className="bottom-nav">
  <span className="active">
    <MdHome />
  </span>

  <button className="add" onClick={() => navigate("/report")}>
    <MdAddCircle />
  </button>

  <span onClick={() => navigate("/reports")}>
    <MdDescription />
  </span>
</nav>

    </div>
  );
}
