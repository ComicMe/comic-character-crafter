import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Panel } from '@/types/panel';
import PanelList from './PanelList';

interface PanelManagerProps {
  panels: Panel[];
  selectedCharacters: string[];
  onPanelsReorder: (panels: Panel[]) => void;
  onPanelUpdate: (index: number, panel: Panel) => void;
  onPanelDelete: (index: number) => void;
  onPanelAdd: () => void;
}

const PanelManager: React.FC<PanelManagerProps> = ({
  panels,
  selectedCharacters,
  onPanelsReorder,
  onPanelUpdate,
  onPanelDelete,
  onPanelAdd,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Script & Panels</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onPanelAdd}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Panel
        </Button>
      </div>
      
      <PanelList
        panels={panels}
        onPanelsReorder={onPanelsReorder}
        onRegeneratePanel={() => {}} // This will be implemented in the parent
        onUpdatePanel={onPanelUpdate}
        onDeletePanel={onPanelDelete}
      />
    </Card>
  );
};

export default PanelManager;