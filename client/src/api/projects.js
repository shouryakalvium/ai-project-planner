async function requestProjects(path = '') {
  const response = await fetch(`/api/projects${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Unable to load projects (${response.status})`);
  }

  return response.json();
}

export function fetchProjects() {
  return requestProjects();
}

export function fetchProject(projectId) {
  return requestProjects(`/${encodeURIComponent(projectId)}`);
}

export async function createProject(project) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Unable to create project (${response.status})`);
  }

  return response.json();
}
