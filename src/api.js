const BASE_URL = import.meta.env.PROD
  ? "https://report2-resolve-backend.vercel.app"
  : "http://127.0.0.1:8000";

const apiFetch = async (endpoint, options = {}) => {

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "API request failed");
  }

  return response.json();
};

export default apiFetch;