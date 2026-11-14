const seedProjects = require('./projects');
const database = require('./database');

async function initializeStore() {
  await database.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      due_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date DATE
    );

    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      target_date DATE,
      status TEXT NOT NULL
    );
  `);

  const { rows } = await database.query('SELECT COUNT(*)::int AS count FROM projects');
  if (rows[0].count !== 0) return;

  for (const project of seedProjects) {
    await addProject(project);
    for (const task of project.tasks) await addTask(project, task);
    for (const milestone of project.milestones) await addMilestone(project, milestone);
  }
}

function mapProject(row, tasks = [], milestones = []) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    tasks,
    milestones,
  };
}

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ? formatDate(row.due_date) : '',
  };
}

function mapMilestone(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date ? formatDate(row.target_date) : '',
    status: row.status,
  };
}

function formatDate(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

async function loadChildren(project) {
  const [tasksResult, milestonesResult] = await Promise.all([
    database.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY id', [project.id]),
    database.query('SELECT * FROM milestones WHERE project_id = $1 ORDER BY id', [project.id]),
  ]);
  return mapProject(project, tasksResult.rows.map(mapTask), milestonesResult.rows.map(mapMilestone));
}

async function listProjects() {
  const { rows } = await database.query('SELECT * FROM projects ORDER BY id');
  return Promise.all(rows.map(loadChildren));
}

async function findProjectById(projectId) {
  const { rows } = await database.query('SELECT * FROM projects WHERE id = $1', [projectId]);
  return rows[0] ? loadChildren(rows[0]) : undefined;
}

async function addProject(project) {
  await database.query(
    'INSERT INTO projects (id, name, description, status, due_date) VALUES ($1, $2, $3, $4, $5)',
    [project.id, project.name, project.description, project.status, project.dueDate],
  );
  return project;
}

async function addTask(project, task) {
  await database.query(
    `INSERT INTO tasks (id, project_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, '')::date)`,
    [task.id, project.id, task.title, task.description, task.status, task.priority, task.dueDate],
  );
  return task;
}

async function findTaskById(project, taskId) {
  const { rows } = await database.query(
    'SELECT * FROM tasks WHERE project_id = $1 AND id = $2',
    [project.id, taskId],
  );
  return rows[0] ? mapTask(rows[0]) : undefined;
}

async function updateTask(project, task) {
  await database.query(
    `UPDATE tasks
     SET title = $1, description = $2, status = $3, priority = $4, due_date = NULLIF($5, '')::date
     WHERE project_id = $6 AND id = $7`,
    [task.title, task.description, task.status, task.priority, task.dueDate, project.id, task.id],
  );
  return task;
}

async function removeTask(project, taskId) {
  const result = await database.query(
    'DELETE FROM tasks WHERE project_id = $1 AND id = $2',
    [project.id, taskId],
  );
  return result.rowCount > 0;
}

async function addMilestone(project, milestone) {
  await database.query(
    `INSERT INTO milestones (id, project_id, title, description, target_date, status)
     VALUES ($1, $2, $3, $4, NULLIF($5, '')::date, $6)`,
    [milestone.id, project.id, milestone.title, milestone.description, milestone.targetDate, milestone.status],
  );
  return milestone;
}

async function findMilestoneById(project, milestoneId) {
  const { rows } = await database.query(
    'SELECT * FROM milestones WHERE project_id = $1 AND id = $2',
    [project.id, milestoneId],
  );
  return rows[0] ? mapMilestone(rows[0]) : undefined;
}

async function updateMilestone(project, milestone) {
  await database.query(
    `UPDATE milestones
     SET title = $1, description = $2, target_date = NULLIF($3, '')::date, status = $4
     WHERE project_id = $5 AND id = $6`,
    [milestone.title, milestone.description, milestone.targetDate, milestone.status, project.id, milestone.id],
  );
  return milestone;
}

async function removeMilestone(project, milestoneId) {
  const result = await database.query(
    'DELETE FROM milestones WHERE project_id = $1 AND id = $2',
    [project.id, milestoneId],
  );
  return result.rowCount > 0;
}

module.exports = {
  initializeStore,
  listProjects,
  findProjectById,
  addProject,
  addTask,
  findTaskById,
  updateTask,
  removeTask,
  addMilestone,
  findMilestoneById,
  updateMilestone,
  removeMilestone,
};
