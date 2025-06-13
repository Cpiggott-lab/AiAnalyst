import axios from "axios";

class ProjectsService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAllProjects() {
    try {
      const res = await this.api.get("/api/projects");
      return res.data;
    } catch (err) {
      console.error(
        "Error fetching projects:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async getProjectById(id) {
    try {
      const res = await this.api.get(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      console.error(
        "Error fetching project:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async generateSummary(id) {
    try {
      const res = await this.api.post(`/api/projects/${id}/summary`);
      console.log("generateSummary response:", res.data);
      return res.data.summary;
    } catch (err) {
      console.error(
        "Error generating summary:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async upload(file, name = "Uploaded Project", prompt = "") {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("prompt", prompt);

      const res = await this.api.post("/api/projects/upload", formData, {
        headers: {
          "Content-Type": "/multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err.response?.data || err.message);
      throw err;
    }
  }

  async askQuestion(projectId, question) {
    try {
      const res = await this.api.post(`/api/projects/${projectId}/question`, {
        question,
      });
      return res.data;
    } catch (err) {
      console.error(
        "Error asking question:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async deleteProject(id) {
    try {
      const res = await this.api.delete(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      console.error(
        "Error deleting project:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async generateChartData(id) {
    try {
      const res = await this.api.get(`/api/projects/${id}/chartdata-universal`);
      return res.data;
    } catch (err) {
      console.error(
        "Error generating chart data:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async updateNote(id, note) {
    try {
      const res = await this.api.put(`/api/projects/${id}/note`, { note });
      return res.data;
    } catch (err) {
      console.error("Error updating note:", err.response?.data || err.message);
      throw err;
    }
  }
}

const projectsService = new ProjectsService();
export default projectsService;
