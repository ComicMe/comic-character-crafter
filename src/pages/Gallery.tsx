import { Card } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";

const Gallery = () => {
  const { projects } = useProject();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Comic Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-4">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Gallery;