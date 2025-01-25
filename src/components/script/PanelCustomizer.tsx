import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { RefreshCw } from 'lucide-react';

interface PanelCustomizerProps {
  panelId: string;
  dialogueSize: number;
  onDialogueSizeChange: (size: number) => void;
  onRegeneratePanel: () => void;
}

const PanelCustomizer = ({
  dialogueSize,
  onDialogueSizeChange,
  onRegeneratePanel,
}: PanelCustomizerProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Dialogue Size</Label>
        <Slider
          value={[dialogueSize]}
          onValueChange={(values) => onDialogueSizeChange(values[0])}
          min={12}
          max={24}
          step={1}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRegeneratePanel}
        className="w-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Regenerate Panel
      </Button>
    </Card>
  );
};

export default PanelCustomizer;