import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createProject, fetchProjects } from '../api/projects.js';

const initialForm = {
  name: '',
  description: '',
  status: 'Planning',
  dueDate: '',
};

function statusClass(status) {
  if (status === 'Planning') return 'status status-planning';
  if (status === 'Complete') return 'status status-complete';
  return 'status status-progress';
}

function ProjectForm({ form, error, isSaving, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-heading">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Project setup</p>
            <h2 id="new-project-heading">Create a new project</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <label className="form-field">
            <span>Project name</span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Mobile app launch"
              required
            />
          </label>
          <label className="form-field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="What are you building?"
              rows="4"
              required
            />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={onChange}>
                <option>Planning</option>
                <option>In progress</option>
                <option>Complete</option>
              </select>
            </label>
            <label className="form-field">
              <span>Due date</span>
              <input name="dueDate" type="date" value={form.dueDate} onChange={onChange} required />
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button className="button button-primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadProjects() {
    setIsLoading(true);
    setLoadError('');

    try {
      setProjects(await fetchProjects());
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openForm() {
    setFormError('');
    setIsFormOpen(true);
  }

  function closeForm() {
    if (!isSaving) setIsFormOpen(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const missingField = [
      ['name', 'Project name'],
      ['description', 'Description'],
      ['dueDate', 'Due date'],
    ].find(([field]) => form[field].trim().length === 0);

    if (missingField) {
      setFormError(`${missingField[1]} is required.`);
      return;
    }

    setIsSaving(true);
    try {
      await createProject(form);
      setIsFormOpen(false);
      setForm(initialForm);
      await loadProjects();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1>My projects</h1>
          <p className="page-intro">Plan, track, and build your projects from one focused workspace.</p>
        </div>
        <button className="button button-primary" type="button" onClick={openForm}>+ New project</button>
      </div>

      {isLoading && <p className="loading-message">Loading projects...</p>}
      {!isLoading && loadError && (
        <div className="message-state" role="alert">
          <p>{loadError}</p>
          <button className="button button-secondary" type="button" onClick={loadProjects}>Try again</button>
        </div>
      )}
      {!isLoading && !loadError && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="card-topline">
                <span className={statusClass(project.status)}>{project.status}</span>
                <span className="due-date">Due {project.dueDate}</span>
              </div>
              <h2>{project.name}</h2>
              <p className="project-description">{project.description}</p>
              <div>
                <div className="progress-label">
                  <span>Overall progress</span>
                  <span className="progress-value">{project.progress}%</span>
                </div>
                <div className="progress-track" aria-label={`${project.progress}% complete`}>
                  <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="card-footer">
                <span className="due-date">{project.tasks.filter((task) => task.complete).length} of {project.tasks.length} tasks complete</span>
                <Link className="button button-secondary" to={`/projects/${project.id}`}>Open project -&gt;</Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {!isLoading && !loadError && projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">+</div>
          <h2>No projects yet</h2>
          <p>Create your first project to start organizing tasks, milestones, and progress.</p>
          <button className="button button-primary" type="button" onClick={openForm}>Create a project</button>
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          form={form}
          error={formError}
          isSaving={isSaving}
          onChange={handleChange}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
