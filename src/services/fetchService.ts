export type ApiRequestParams<T = any> = {
  endpoint: string
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
  jsonBody?: T | null
  formData?: FormData | null
  elementId?: number
  token?: string
}


const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function apiRequest<T, ResponseApi=any>({
  endpoint,
  method="GET",
  jsonBody,
  formData,
  elementId,
  token
}: ApiRequestParams<T>){
  {
    let url = `${apiBaseUrl}${endpoint}`;
  
    // Si el método es DELETE, añadir el ID al endpoint
    if (method === "DELETE" && elementId) {
      url = `${url}${elementId}/`;
    }
  
    const headers = new Headers();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    // No añadir Content-Type si formData está presente
    if (jsonBody && method !== "DELETE" && !formData) {
      headers.append("Content-Type", "application/json");
    }
  
    const options: RequestInit = {
      method,
      headers
    };
  
    if (jsonBody && method !== "DELETE" && !formData) {
      options.body = JSON.stringify(jsonBody);
    } else if (formData) {
      options.body = formData;
    }
  
    try {
      console.log("Fetch Options", options)
      const response = await fetch(url, {
        ...options,
      });
      const data = await response.json();
      return data as ResponseApi;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }
}
