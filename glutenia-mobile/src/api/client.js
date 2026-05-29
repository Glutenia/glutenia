import Constants from "expo-constants";
import { Platform } from "react-native";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const getHostFromExpo = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0];
};

export const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return trimTrailingSlash(process.env.EXPO_PUBLIC_API_URL);
  }

  const configuredUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl);
  }

  const host = getHostFromExpo();
  if (host) {
    return `http://${host}:5000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
};

const request = async (path, options = {}) => {
  const { token, body, ...rest } = options;
  const headers = {
    "Content-Type": "application/json",
    ...(rest.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: "Invalid server response",
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
};

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body }),
  register: (body) => request("/auth/register", { method: "POST", body }),
  me: (token) => request("/auth/me", { token }),
  products: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value)
    ).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  product: (id) => request(`/products/${id}`),
  createProduct: (token, body) =>
    request("/products", { method: "POST", token, body }),
  updateProduct: (token, id, body) =>
    request(`/products/${id}`, { method: "PUT", token, body }),
  deleteProduct: (token, id) =>
    request(`/products/${id}`, { method: "DELETE", token }),
  createOrder: (token, body) =>
    request("/orders", { method: "POST", token, body }),
  myOrders: (token) => request("/orders/my", { token }),
  allOrders: (token) => request("/orders", { token }),
};
