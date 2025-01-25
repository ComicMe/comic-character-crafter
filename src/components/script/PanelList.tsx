import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface Panel {
  id: string;
  scene: string;
  dialogue: string;
  characters: string[];
  generatedImage?: string;
}

interface PanelListProps {
  panels: Panel[];
  onPanelsReorder: (panels: Panel[]) => void;
  onRegeneratePanel: (panelIndex: number) => void;
}

const PanelList = ({ panels, onPanelsReorder, onRegeneratePanel }: PanelListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(panels);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onPanelsReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="panels">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {panels.map((panel, index) => (
              <Draggable
                key={panel.id}
                draggableId={panel.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border rounded-lg p-4 bg-background"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Panel {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegeneratePanel(index)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm mb-2">{panel.scene}</p>
                    <p className="text-sm italic mb-2">{panel.dialogue}</p>
                    
                    {panel.generatedImage && (
                      <img
                        src={panel.generatedImage}
                        alt={`Panel ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PanelList;