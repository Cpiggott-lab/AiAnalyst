import { useEffect, useState } from "react";

export default function useProjects() {
  const [projects, setprojects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setprojects(data);
    }
    fetchProjects();
  }, []);

  return projects;
}
