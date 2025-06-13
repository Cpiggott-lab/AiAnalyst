import axios from "axios";

// Use environment variable or fallback to localhost
const API = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  async register(email, password) {
    try {
      const res = await axios.post(
        `${API}/register`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  }

  async login(email, password) {
    try {
      const res = await axios.post(
        `${API}/login`,
        { email, password },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  }

  async logout() {
    try {
      await axios.post(`${API}/logout`, null, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      throw err;
    }
  }

  async getCurrentUser() {
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error(
        "Get current user error:",
        err.response?.data || err.message
      );
      throw err;
    }
  }
}

export default new AuthService();
