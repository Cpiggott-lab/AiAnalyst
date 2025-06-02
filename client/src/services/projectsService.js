// HTTP Requests class
import axios from "axios";

class ProjectsService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5001/api",
      withCredentials: true,
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

  async uploadCSV(file, name = "Uploaded Project") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const res = await this.api.post("/projects/upload", formData);
    return res.data;
  }
}

const projectsService = new ProjectsService();
export default projectsService;
