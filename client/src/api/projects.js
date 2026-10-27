async function requestProjects(path = '') {
  const response = await fetch(`/api/projects${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Unable to load projects (${response.status})`);
  }

  return response.json();
}

async function requestProjectResource(projectId, resource, options = {}) {
  const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/${resource}`, {
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Unable to update ${resource} (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
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

export function createTask(projectId, task) {
  return requestProjectResource(projectId, 'tasks', { method: 'POST', body: task });
}

export function updateTask(projectId, taskId, task) {
  return requestProjectResource(projectId, `tasks/${encodeURIComponent(taskId)}`, { method: 'PATCH', body: task });
}

export function deleteTask(projectId, taskId) {
  return requestProjectResource(projectId, `tasks/${encodeURIComponent(taskId)}`, { method: 'DELETE' });
}

export function createMilestone(projectId, milestone) {
  return requestProjectResource(projectId, 'milestones', { method: 'POST', body: milestone });
}

export function updateMilestone(projectId, milestoneId, milestone) {
  return requestProjectResource(projectId, `milestones/${encodeURIComponent(milestoneId)}`, { method: 'PATCH', body: milestone });
}

export function deleteMilestone(projectId, milestoneId) {
  return requestProjectResource(projectId, `milestones/${encodeURIComponent(milestoneId)}`, { method: 'DELETE' });
}
