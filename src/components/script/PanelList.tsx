import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import PanelEditor from './PanelEditor';
import { Panel } from '@/types/panel';

interface PanelListProps {
  panels: Panel[];
  regeneratingPanels: {[key: string]: boolean};
  onPanelsReorder: (panels: Panel[]) => void;
  onRegeneratePanel: (pageIndex: number, panelIndex: number) => void;
  onUpdatePanel: (index: number, panel: Panel) => void;
  onDeletePanel: (index: number) => void;
}

const PanelList = ({
  panels,
  regeneratingPanels,
  onPanelsReorder,
  onRegeneratePanel,
  onUpdatePanel,
  onDeletePanel
}: PanelListProps) => {
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
                    className="bg-background"
                  >
                    <PanelEditor
                      panel={panel}
                      isRegenerating={regeneratingPanels[panel.id]}
                      onUpdate={(updatedPanel) => onUpdatePanel(index, updatedPanel)}
                      onRegenerate={() => onRegeneratePanel(0, index)}
                      onDelete={() => onDeletePanel(index)}
                    />
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