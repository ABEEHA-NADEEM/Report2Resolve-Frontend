import { useState, useEffect } from "react"
import "../styles/global.css"
import logo from "../assets/logo.png"
import apiFetch from "../api"

// ⚠️ Replace with real UUIDs from your issue_status table
const DEFAULT_STATUS_ID   = "5ade587e-e51a-4fd1-aa87-411d9268b3a4"
const DEFAULT_LOCATION_ID = "a1c7b3de-9c32-4a6e-9c1c-2b5d72e1f9aa"

export default function ReportIssue() {

  const [image, setImage]           = useState(null)
  const [imageFile, setImageFile]   = useState(null)
  const [title, setTitle]           = useState("")
  const [description, setDescription] = useState("")
  const [remarks, setRemarks]       = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [categories, setCategories] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]       = useState(false)
  const [message, setMessage]       = useState(null)

  // ✅ Load categories and departments from your actual Supabase tables
  useEffect(() => {
    apiFetch("/categories").then(setCategories).catch(console.error)
    apiFetch("/departments").then(setDepartments).catch(console.error)
  }, [])

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]))
      setImageFile(e.target.files[0])
    }
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload-image", { method: "POST", body: formData })
    if (!res.ok) throw new Error("Image upload failed")
    const data = await res.json()
    return data.url
  }

  const handleSubmit = async () => {
    setMessage(null)

    if (!title.trim())       return setMessage({ type: "error", text: "Enter issue title." })
    if (!description.trim()) return setMessage({ type: "error", text: "Enter description." })
    if (!categoryId)         return setMessage({ type: "error", text: "Select a category." })
    if (!departmentId)       return setMessage({ type: "error", text: "Select a department." })

    setLoading(true)

    try {
      let imageUrls = []
      if (imageFile) {
        const url = await uploadImage(imageFile)
        imageUrls = [url]
      }

      const payload = {
        title,
        description,
        category_id:        categoryId,
        department_id:      departmentId,
        location_id:        DEFAULT_LOCATION_ID,
        user_id:            null,             // guest user
        current_status_id:  DEFAULT_STATUS_ID,
        remarks:            remarks || "Submitted by guest",
        images:             imageUrls,
      }

      const data = await apiFetch("/create-issue", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (data.ok) {
        setMessage({ type: "success", text: "Issue submitted successfully! 🎉" })
        setTitle(""); setDescription(""); setRemarks("")
        setCategoryId(""); setDepartmentId("")
        setImage(null); setImageFile(null)
      } else {
        setMessage({ type: "error", text: data.error || "Submission failed." })
      }

    } catch (err) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="report-wrapper">
      <img src={logo} alt="logo" className="report-logo"/>

      <div className="report-card">
        <h2>Report an Issue</h2>
        <p className="report-sub">
          Help us resolve problems faster by providing accurate details.
        </p>

        {message && (
          <p style={{ color: message.type === "error" ? "#e53e3e" : "#38a169", marginBottom: 12 }}>
            {message.text}
          </p>
        )}

        {/* Upload */}
        <label className="upload-box">
          <input type="file" accept="image/*" onChange={handleImage}/>
          {image
            ? <img src={image} alt="preview"/>
            : <span>📷 Click to upload image</span>
          }
        </label>

        {/* Title */}
        <input
          className="modern-input"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="modern-input"
          rows={4}
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Remarks */}
        <input
          className="modern-input"
          placeholder="Any additional remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* Category — loaded from DB */}
        <select
          className="modern-input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.category_name}
            </option>
          ))}
        </select>

        {/* Department — loaded from DB */}
        <select
          className="modern-input"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <button
          className="primary-btn report-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>

      </div>
    </div>
  )
}