import axios from "axios";

class ProjectsService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5001/api",
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAllProjects() {
    const res = await this.api.get("/projects");
    return res.data;
  }

  async getProjectById(id) {
    const res = await this.api.get(`/projects/${id}`);
    return res.data;
  }

  async generateSummary(id) {
    const res = await this.api.post(`/projects/${id}/summary`);
    return res.data.summary;
  }

  async upload(file, name = "Uploaded Project") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const res = await this.api.post("/projects/upload", formData);
    return res.data;
  }

  async askQuestion(projectId, question) {
    const res = await this.api.post(`/projects/${projectId}/question`, {
      question,
    });
    return res.data;
  }

  async deleteProject(id) {
    const res = await this.api.delete(`/projects/${id}`);
    return res.data;
  }
}

const projectsService = new ProjectsService();
export default projectsService;
