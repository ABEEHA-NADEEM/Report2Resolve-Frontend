import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Camera, MapPin, CheckCircle } from "lucide-react"
import "../styles/global.css"
import logo from "../assets/logo.png"

export default function Onboarding() {

  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  const slides = [
    {
      icon: <Camera size={60} color="#2F80ED" />,
      title: "Report Issues Easily",
      desc: "Take a photo, describe the problem, and submit in seconds. We make reporting simple and quick."
    },
    {
      icon: <MapPin size={60} color="#27AE60" />,
      title: "Track Progress",
      desc: "Get real-time updates on your reports. See exactly where your issue stands and when it will be resolved."
    },
    {
      icon: <CheckCircle size={60} color="#9B51E0" />,
      title: "Get Resolution",
      desc: "Stay informed with notifications and see proof of resolution. Your voice creates real change."
    }
  ]

const nextSlide = () => {
  if (index < slides.length - 1) {
    setIndex(index + 1)
  } else {
    navigate("/auth")
  }
}


  return (
    <div className="onboard-container">
<img src={logo} alt="Report2Resolve Logo" className="onboard-logo" />
      {/* Skip */}
      <div className="skip" onClick={() => navigate("/home")}>
        Skip
      </div>

      {/* Icon */}
      <div className="icon-circle">
        {slides[index].icon}
      </div>

      {/* Text */}
      <h2>{slides[index].title}</h2>
      <p className="desc">{slides[index].desc}</p>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
          ></span>
        ))}
      </div>

      {/* Button */}
      <button className="primary-btn" onClick={nextSlide}>
        {index === slides.length - 1 ? "Get Started" : "Next"}
      </button>

    </div>
  )
}
