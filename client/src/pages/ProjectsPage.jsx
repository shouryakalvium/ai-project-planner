import { Link } from 'react-router-dom';
import { projects } from '../data/projects.js';

function statusClass(status) {
  return status === 'Planning' ? 'status status-planning' : 'status status-progress';
}

export default function ProjectsPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1>My projects</h1>
          <p className="page-intro">Plan, track, and build your projects from one focused workspace.</p>
        </div>
        <button className="button button-primary" type="button">+ New project</button>
      </div>

      {projects.length > 0 ? (
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
      ) : (
        <div className="empty-state">
          <div className="empty-icon">+</div>
          <h2>No projects yet</h2>
          <p>Create your first project to start organizing tasks, milestones, and progress.</p>
          <button className="button button-primary" type="button">Create a project</button>
        </div>
      )}
    </section>
  );
}
