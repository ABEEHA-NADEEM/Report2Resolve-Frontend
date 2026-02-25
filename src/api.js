const BASE_URL = import.meta.env.PROD
  ? "https://report2-resolve-backend.vercel.app"  // ✅ production backend
  : "/api"                                          // ✅ local dev via proxy


const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "API request failed");
  }

  return response.json();
};

export default apiFetch;
