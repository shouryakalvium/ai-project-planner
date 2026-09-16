export const projects = [
  {
    id: 'ai-project-planner',
    name: 'AI Project Planner',
    description: 'Plan, track, and build intelligent products with a clear path from idea to launch.',
    status: 'In progress',
    progress: 80,
    dueDate: 'Sep 28, 2026',
    tasks: [
      { title: 'Define product requirements', complete: true },
      { title: 'Design the project workspace', complete: true },
      { title: 'Connect project data layer', complete: false },
      { title: 'Prepare the first release', complete: false },
    ],
    milestones: [
      { title: 'Foundation', date: 'Completed', complete: true },
      { title: 'Workspace UI', date: 'In progress', complete: false },
      { title: 'First release', date: 'Sep 28', complete: false },
    ],
  },
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    description: 'A focused portfolio experience for sharing selected work and case studies.',
    status: 'Planning',
    progress: 50,
    dueDate: 'Oct 12, 2026',
    tasks: [
      { title: 'Collect project content', complete: true },
      { title: 'Outline the site structure', complete: false },
      { title: 'Create visual direction', complete: false },
    ],
    milestones: [
      { title: 'Content inventory', date: 'Completed', complete: true },
      { title: 'Visual direction', date: 'Oct 02', complete: false },
      { title: 'Publish portfolio', date: 'Oct 12', complete: false },
    ],
  },
];
