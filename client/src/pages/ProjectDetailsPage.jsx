import { useParams } from 'react-router-dom';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();

  return (
    <main>
      <h1>Project details</h1>
      <p>Project: {projectId}</p>
      <p>Tasks will appear here.</p>
    </main>
  );
}
