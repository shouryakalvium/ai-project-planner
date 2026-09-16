import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects.js';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const completedTasks = project.tasks.filter((task) => task.complete).length;

  return (
    <section>
      <Link className="back-link" to="/">&lt;- Back to projects</Link>
      <div className="detail-header">
        <div className="detail-topline">
          <div>
            <p className="eyebrow">Project workspace</p>
            <h1>{project.name}</h1>
          </div>
          <span className={project.status === 'Planning' ? 'status status-planning' : 'status status-progress'}>{project.status}</span>
        </div>
        <p className="detail-summary">{project.description}</p>
        <div className="detail-progress">
          <div className="progress-label">
            <span>Overall progress</span>
            <span className="progress-value">{project.progress}%</span>
          </div>
          <div className="progress-track" aria-label={`${project.progress}% complete`}>
            <div className="progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
          <div className="detail-meta">
            <span>{completedTasks} of {project.tasks.length} tasks complete</span>
            <span>Due {project.dueDate}</span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <section className="panel" aria-labelledby="tasks-heading">
          <div className="panel-heading">
            <h2 id="tasks-heading">Tasks</h2>
            <span>{project.tasks.length} items</span>
          </div>
          <ul className="task-list">
            {project.tasks.map((task) => (
              <li className="task-item" key={task.title}>
                <span className={task.complete ? 'check done' : 'check'}>{task.complete ? '✓' : ''}</span>
                <span className={task.complete ? 'task-title done' : 'task-title'}>{task.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="milestones-heading">
          <div className="panel-heading">
            <h2 id="milestones-heading">Milestones</h2>
            <span>{project.milestones.length} checkpoints</span>
          </div>
          <ul className="milestone-list">
            {project.milestones.map((milestone) => (
              <li className="milestone-item" key={milestone.title}>
                <span className={milestone.complete ? 'milestone-dot done' : 'milestone-dot'} />
                <div className="milestone-copy">
                  <strong>{milestone.title}</strong>
                  <span>{milestone.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
