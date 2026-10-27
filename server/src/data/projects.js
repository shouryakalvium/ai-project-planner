const projects = [
  {
    id: 'ai-project-planner',
    name: 'AI Project Planner',
    description: 'Plan, track, and build intelligent products with a clear path from idea to launch.',
    status: 'In progress',
    dueDate: 'Sep 28, 2026',
    tasks: [
      { id: 'task-foundation-requirements', title: 'Define product requirements', description: '', status: 'Complete', priority: 'High', dueDate: '' },
      { id: 'task-workspace-design', title: 'Design the project workspace', description: '', status: 'Complete', priority: 'Medium', dueDate: '' },
      { id: 'task-data-layer', title: 'Connect project data layer', description: '', status: 'In progress', priority: 'High', dueDate: '' },
      { id: 'task-first-release', title: 'Prepare the first release', description: '', status: 'Todo', priority: 'Medium', dueDate: '' },
    ],
    milestones: [
      { id: 'milestone-foundation', title: 'Foundation', description: '', targetDate: '', status: 'Complete' },
      { id: 'milestone-workspace', title: 'Workspace UI', description: '', targetDate: '', status: 'In progress' },
      { id: 'milestone-release', title: 'First release', description: '', targetDate: '2026-09-28', status: 'Planned' },
    ],
  },
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    description: 'A focused portfolio experience for sharing selected work and case studies.',
    status: 'Planning',
    dueDate: 'Oct 12, 2026',
    tasks: [
      { id: 'task-content-inventory', title: 'Collect project content', description: '', status: 'Complete', priority: 'Medium', dueDate: '' },
      { id: 'task-site-structure', title: 'Outline the site structure', description: '', status: 'Todo', priority: 'Medium', dueDate: '' },
      { id: 'task-visual-direction', title: 'Create visual direction', description: '', status: 'Todo', priority: 'Low', dueDate: '' },
    ],
    milestones: [
      { id: 'milestone-content', title: 'Content inventory', description: '', targetDate: '', status: 'Complete' },
      { id: 'milestone-visual', title: 'Visual direction', description: '', targetDate: '2026-10-02', status: 'Planned' },
      { id: 'milestone-publish', title: 'Publish portfolio', description: '', targetDate: '2026-10-12', status: 'Planned' },
    ],
  },
];

module.exports = projects;
