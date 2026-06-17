import { useState, useEffect } from "react"
import "../styles/global.css"
import logo from "../assets/logo.png"
import apiFetch from "../api"

const DEFAULT_STATUS_ID   = "5ade587e-e51a-4fd1-aa87-411d9268b3a4"
const DEFAULT_LOCATION_ID = "a1c7b3de-9c32-4a6e-9c1c-2b5d72e1f9aa"

export default function ReportIssue() {

  const [image, setImage]               = useState(null)
  const [imageFile, setImageFile]       = useState(null)
  const [title, setTitle]               = useState("")
  const [description, setDescription]   = useState("")
  const [remarks, setRemarks]           = useState("")
  const [categoryId, setCategoryId]     = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [categories, setCategories]     = useState([])
  const [departments, setDepartments]   = useState([])
  const [loading, setLoading]           = useState(false)
  const [loadingData, setLoadingData]   = useState(true)
  const [message, setMessage]           = useState(null)
  const [apiError, setApiError]         = useState(null)

  // ✅ null if guest, real UUID if logged in
  const user   = JSON.parse(localStorage.getItem("user"))
  const userId = user?.user_id || null

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        setApiError(null)
        
        console.log("📥 Fetching categories and departments...")

        // Fetch categories
        try {
          const categoriesData = await apiFetch("/categories")
          console.log("✅ Categories received:", categoriesData)
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData)
          } else {
            console.warn("❌ Categories not an array:", categoriesData)
            setApiError("Failed to load categories")
          }
        } catch (catErr) {
          console.error("❌ Categories error:", catErr)
          setApiError(catErr.message)
        }

        // Fetch departments
        try {
          const departmentsData = await apiFetch("/departments")
          console.log("✅ Departments received:", departmentsData)
          if (Array.isArray(departmentsData)) {
            setDepartments(departmentsData)
          } else {
            console.warn("❌ Departments not an array:", departmentsData)
            setApiError("Failed to load departments")
          }
        } catch (deptErr) {
          console.error("❌ Departments error:", deptErr)
          setApiError(deptErr.message)
        }

        setLoadingData(false)

      } catch (err) {
        console.error("❌ Data fetch error:", err)
        setApiError(err.message)
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]))
      setImageFile(e.target.files[0])
    }
  }

  // ✅ Upload image with proper error handling
  const uploadImage = async (file) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const BASE_URL = "https://report2-resolve-backend-8i4bwosfz.vercel.app"
      console.log(`📤 Uploading image to: ${BASE_URL}/upload-image`)
      
      const res = await fetch(`${BASE_URL}/upload-image`, {
        method: "POST",
        body: formData
      })

      console.log(`Response status: ${res.status}`)

      if (!res.ok) {
        const error = await res.json()
        console.error("❌ Upload response error:", error)
        throw new Error(error.error || `Upload failed with status ${res.status}`)
      }

      const data = await res.json()
      console.log("✅ Image uploaded:", data.url)
      
      if (!data.url) {
        throw new Error("No URL returned from upload")
      }

      return data.url

    } catch (err) {
      console.error("❌ Image upload error:", err)
      throw err
    }
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
        console.log("📤 Starting image upload...")
        const url = await uploadImage(imageFile)
        imageUrls = [url]
        console.log("✅ Image URL ready:", url)
      }

      const payload = {
        title,
        description,
        category_id:       categoryId,
        department_id:     departmentId,
        location_id:       DEFAULT_LOCATION_ID,
        user_id:           userId,
        current_status_id: DEFAULT_STATUS_ID,
        remarks:           remarks || "Submitted by guest",
        images:            imageUrls,
      }

      console.log("📝 Creating issue with payload:", payload)
      
      const data = await apiFetch("/create-issue", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      console.log("📩 Issue creation response:", data)

      if (data.ok) {
        setMessage({ type: "success", text: "✅ Issue submitted successfully! 🎉" })
        setTitle(""); setDescription(""); setRemarks("")
        setCategoryId(""); setDepartmentId("")
        setImage(null); setImageFile(null)
        console.log("✅ Issue created with ID:", data.issue_id)
      } else {
        setMessage({ type: "error", text: data.error || "Submission failed." })
        console.error("❌ Submission error:", data.error)
      }

    } catch (err) {
      console.error("❌ Submission error:", err)
      setMessage({ type: "error", text: `Error: ${err.message}` })
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

        {/* ✅ shows guest or real name */}
        <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
          Submitting as: <strong>{user ? user.name : "Guest"}</strong>
        </p>

        {/* ❌ Show API errors */}
        {apiError && (
          <p style={{ color: "#e53e3e", marginBottom: 12, fontSize: 13 }}>
            ⚠️ Failed to load options: {apiError}
          </p>
        )}

        {/* ✅ Show messages */}
        {message && (
          <p style={{ color: message.type === "error" ? "#e53e3e" : "#38a169", marginBottom: 12 }}>
            {message.text}
          </p>
        )}

        <label className="upload-box">
          <input type="file" accept="image/*" onChange={handleImage}/>
          {image ? <img src={image} alt="preview"/> : <span>📷 Click to upload image</span>}
        </label>

        <input className="modern-input" placeholder="Issue Title"
          value={title} onChange={(e) => setTitle(e.target.value)}/>

        <textarea className="modern-input" rows={4} placeholder="Describe the issue..."
          value={description} onChange={(e) => setDescription(e.target.value)}/>

        <input className="modern-input" placeholder="Any additional remarks (optional)"
          value={remarks} onChange={(e) => setRemarks(e.target.value)}/>

        {/* Categories Dropdown */}
        <select className="modern-input" value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)} disabled={loadingData}>
          <option value="">
            {loadingData ? "Loading categories..." : "Select Category"}
          </option>
          {categories.length > 0 ? (
            categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>

        {/* Departments Dropdown */}
        <select className="modern-input" value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)} disabled={loadingData}>
          <option value="">
            {loadingData ? "Loading departments..." : "Select Department"}
          </option>
          {departments.length > 0 ? (
            departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))
          ) : (
            <option disabled>No departments available</option>
          )}
        </select>

        <button className="primary-btn report-btn" onClick={handleSubmit} disabled={loading || loadingData}>
          {loadingData ? "Loading..." : loading ? "Submitting..." : "Submit Issue"}
        </button>

      </div>
    </div>
  )
}