import axios from "axios";

const API = "http://localhost:5001/api/auth";

class AuthService {
  async register(email, password) {
    console.log("Register request body:", req.body);

    const response = await axios.post(`${API}/register`, { email, password });
    return response.data;
  }

  async login(email, password) {
    const response = await axios.post(
      `${API}/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  }

  async logout() {
    await axios.post(`${API}/logout`, null, {
      withCredentials: true,
    });
  }

  async getCurrentUser() {
    const response = await axios.get(`${API}/me`, {
      withCredentials: true,
    });
    return response.data;
  }
}

export default new AuthService();
