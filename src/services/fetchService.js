const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiRequest = async ({
  endpoint,
  method = "GET",
  jsonBody = null,
  formData = null,
  token = null,
  elementId = null,
}) => {
  let url = `${apiBaseUrl}${endpoint}`;

  // Si el método es DELETE, añadir el ID al endpoint
  if (method === "DELETE" && elementId) {
    url = `${url}${elementId}/`;
  }

  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  if (jsonBody && method !== "DELETE") {
    headers.append("Content-Type", "application/json");
  }

  const options = {
    method,
    headers,
  };

  if (jsonBody && method !== "DELETE") {
    options.body = JSON.stringify(jsonBody);
  } else if (formData) {
    options.body = formData;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
