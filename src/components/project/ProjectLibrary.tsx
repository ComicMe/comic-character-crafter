import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { formatDistanceToNow } from 'date-fns';
import { getcomicByID } from '@/services/api-utils';

const ProjectLibrary = () => {
  const { projects, setCurrentProject, deleteProject } = useProject();
  const [projectList, setProject] = useState<any[]>([])
  const fetchComic = async()=>{
    try {
      projects.forEach(async (project)=>{
        const response = await getcomicByID(project.id)
        if (response) {
          console.log(response);
          
          setProject([...projectList, response])
        }else{return}
      })
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectList.map((project) => (
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