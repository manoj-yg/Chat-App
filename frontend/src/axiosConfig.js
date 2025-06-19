import axios from "axios";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Avoid multiple redirects
      if (window.location.pathname !== "/login") {
        history.push("/login");
        window.location.reload(); // Force rerender for login route
      }
    }
    return Promise.reject(err);
  }
);

export default api;
