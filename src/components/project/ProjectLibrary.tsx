import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { formatDistanceToNow } from 'date-fns';

const ProjectLibrary = () => {
  const { projects, setCurrentProject, deleteProject } = useProject();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(new Date(project.updatedAt))} ago
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentProject(project)}
              >
                Open
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteProject(project.id)}
              >
                🗑️
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectLibrary;