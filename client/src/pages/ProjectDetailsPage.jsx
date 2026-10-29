import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  createMilestone,
  createTask,
  deleteMilestone,
  deleteTask,
  fetchProject,
  updateMilestone,
  updateTask,
} from '../api/projects.js';

const emptyTask = { title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' };
const emptyMilestone = { title: '', description: '', status: 'Planned', targetDate: '' };

function statusClass(status) {
  if (status === 'Planning' || status === 'Todo' || status === 'Planned') return 'status status-planning';
  if (status === 'Complete') return 'status status-complete';
  return 'status status-progress';
}

function ItemForm({ type, value, error, isSaving, onChange, onClose, onSubmit }) {
  const isTask = type === 'task';
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby={`${type}-form-heading`}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{isTask ? 'Task management' : 'Project checkpoint'}</p>
            <h2 id={`${type}-form-heading`}>{value.id ? `Edit ${type}` : `Add ${type}`}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} disabled={isSaving} aria-label="Close form">×</button>
        </div>
        <form onSubmit={onSubmit}>
          <label className="form-field">
            <span>Title</span>
            <input name="title" value={value.title} onChange={onChange} required autoFocus />
          </label>
          <label className="form-field">
            <span>Description <small>(optional)</small></span>
            <textarea name="description" value={value.description} onChange={onChange} rows="3" />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Status</span>
              <select name="status" value={value.status} onChange={onChange}>
                {(isTask ? ['Todo', 'In progress', 'Complete'] : ['Planned', 'In progress', 'Complete']).map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            {isTask ? (
              <label className="form-field">
                <span>Priority</span>
                <select name="priority" value={value.priority} onChange={onChange}>
                  {['Low', 'Medium', 'High'].map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </label>
            ) : (
              <label className="form-field">
                <span>Target date <small>(optional)</small></span>
                <input name="targetDate" type="date" value={value.targetDate} onChange={onChange} />
              </label>
            )}
          </div>
          {isTask && <label className="form-field"><span>Due date <small>(optional)</small></span><input name="dueDate" type="date" value={value.dueDate} onChange={onChange} /></label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formType, setFormType] = useState('');
  const [form, setForm] = useState(emptyTask);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  async function loadProject(showLoading = true) {
    if (showLoading) setIsLoading(true);
    setError('');
    try { setProject(await fetchProject(projectId)); } catch (requestError) { setProject(null); setError(requestError.message); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { loadProject(); }, [projectId]);

  function openForm(type, item = null) {
    setFormType(type);
    setForm(item ? { ...item } : type === 'task' ? { ...emptyTask } : { ...emptyMilestone });
    setFormError('');
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setIsSaving(true); setFormError('');
    try {
      if (formType === 'task') {
        if (form.id) await updateTask(projectId, form.id, form);
        else await createTask(projectId, form);
      } else if (form.id) await updateMilestone(projectId, form.id, form);
      else await createMilestone(projectId, form);
      setFormType(''); await loadProject(false);
    } catch (requestError) { setFormError(requestError.message); }
    finally { setIsSaving(false); }
  }

  async function removeItem(type, item) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      if (type === 'task') await deleteTask(projectId, item.id);
      else await deleteMilestone(projectId, item.id);
      await loadProject(false);
    } catch (requestError) { setActionError(requestError.message); }
  }

  async function toggleTask(task) {
    setActionError('');
    try { await updateTask(projectId, task.id, { status: task.status === 'Complete' ? 'Todo' : 'Complete' }); await loadProject(false); }
    catch (requestError) { setActionError(requestError.message); }
  }

  if (isLoading) return <section><Link className="back-link" to="/">&lt;- Back to projects</Link><p className="loading-message">Loading project...</p></section>;
  if (error || !project) return <section><Link className="back-link" to="/">&lt;- Back to projects</Link><div className="message-state" role="alert"><h1>Project unavailable</h1><p>{error || 'This project could not be found.'}</p><button className="button button-secondary" type="button" onClick={() => loadProject()}>Try again</button></div></section>;

  const completedTasks = project.tasks.filter((task) => task.status === 'Complete').length;
  const completedMilestones = project.milestones.filter((milestone) => milestone.status === 'Complete').length;
  return (
    <section>
      <Link className="back-link" to="/">&lt;- Back to projects</Link>
      <div className="detail-header">
        <div className="detail-topline"><div><p className="eyebrow">Project workspace</p><h1>{project.name}</h1></div><span className={statusClass(project.status)}>{project.status}</span></div>
        <p className="detail-summary">{project.description}</p>
        <div className="detail-progress"><div className="progress-label"><span>Overall progress</span><span className="progress-value">{project.progress}%</span></div><div className="progress-track" aria-label={`${project.progress}% complete`}><div className="progress-fill" style={{ width: `${project.progress}%` }} /></div><div className="detail-meta"><span>{completedTasks} of {project.tasks.length} tasks complete</span><span>{completedMilestones} of {project.milestones.length} milestones complete</span><span>Due {project.dueDate}</span></div></div>
      </div>
      {actionError && <p className="form-error action-error" role="alert">{actionError}</p>}
      <div className="workspace-tabs" role="tablist" aria-label="Project workspace sections">
        <button className={activeTab === 'tasks' ? 'workspace-tab active' : 'workspace-tab'} type="button" role="tab" aria-selected={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
          <span>Tasks</span><small>{project.tasks.length}</small>
        </button>
        <button className={activeTab === 'milestones' ? 'workspace-tab active' : 'workspace-tab'} type="button" role="tab" aria-selected={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')}>
          <span>Milestones</span><small>{project.milestones.length}</small>
        </button>
      </div>
      <div className="detail-layout">
        {activeTab === 'tasks' && <section className="panel" aria-labelledby="tasks-heading" role="tabpanel">
          <div className="panel-heading"><div><p className="panel-kicker">Execution</p><h2 id="tasks-heading">Tasks</h2></div><div className="panel-heading-actions"><span>{completedTasks}/{project.tasks.length} done</span><button className="button button-primary" type="button" onClick={() => openForm('task')}>+ Add task</button></div></div>
          {project.tasks.length === 0 && <p className="empty-panel">No tasks yet. Add the first task to start tracking progress.</p>}
          <ul className="task-list">{project.tasks.map((task) => <li className="task-item" key={task.id}><button className={task.status === 'Complete' ? 'check done' : 'check'} type="button" onClick={() => toggleTask(task)} aria-label={task.status === 'Complete' ? `Reopen ${task.title}` : `Complete ${task.title}`}>{task.status === 'Complete' ? '✓' : ''}</button><div className="item-copy"><span className={task.status === 'Complete' ? 'task-title done' : 'task-title'}>{task.title}</span><span className="item-meta">{task.priority} priority{task.dueDate && ` · Due ${task.dueDate}`}</span></div><div className="item-actions"><button className="text-button" type="button" onClick={() => openForm('task', task)}>Edit</button><button className="text-button danger" type="button" onClick={() => removeItem('task', task)}>Delete</button></div></li>)}</ul>
        </section>
        }
        {activeTab === 'milestones' && <section className="panel" aria-labelledby="milestones-heading" role="tabpanel">
          <div className="panel-heading"><div><p className="panel-kicker">Key outcomes</p><h2 id="milestones-heading">Milestones</h2></div><div className="panel-heading-actions"><span>{completedMilestones}/{project.milestones.length} done</span><button className="button button-primary" type="button" onClick={() => openForm('milestone')}>+ Add milestone</button></div></div>
          {project.milestones.length === 0 && <p className="empty-panel">No milestones yet. Add a checkpoint for an important project outcome.</p>}
          <ul className="milestone-list">{project.milestones.map((milestone) => <li className="milestone-item" key={milestone.id}><span className={milestone.status === 'Complete' ? 'milestone-dot done' : 'milestone-dot'} /><div className="item-copy"><strong>{milestone.title}</strong><span className="item-meta"><span className={statusClass(milestone.status)}>{milestone.status}</span>{milestone.targetDate ? ` Target ${milestone.targetDate}` : ' No target date'}</span></div><div className="item-actions"><button className="text-button" type="button" onClick={() => openForm('milestone', milestone)}>Edit</button><button className="text-button danger" type="button" onClick={() => removeItem('milestone', milestone)}>Delete</button></div></li>)}</ul>
        </section>
        }
      </div>
      {formType && <ItemForm type={formType} value={form} error={formError} isSaving={isSaving} onChange={handleChange} onClose={() => !isSaving && setFormType('')} onSubmit={handleSubmit} />}
    </section>
  );
}
