import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PanelEditorProps {
  panel: {
    id: string;
    scene: string;
    dialogue: string;
    characters: string[];
    generatedImage?: string;
  };
  onUpdate: (updatedPanel: any) => void;
  onRegenerate: () => void;
  onDelete: () => void;
}

const PanelEditor = ({ panel, onUpdate, onRegenerate, onDelete }: PanelEditorProps) => {
  const handleSceneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...panel,
      scene: e.target.value
    });
  };

  const handleDialogueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...panel,
      dialogue: e.target.value
    });
  };

  const handleRegenerate = () => {
    onRegenerate();
    toast.success('Regenerating panel...');
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Label>Scene Description</Label>
          <Textarea
            value={panel.scene}
            onChange={handleSceneChange}
            placeholder="Describe the scene..."
            className="min-h-[100px]"
          />
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRegenerate}
            title="Regenerate panel"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            title="Delete panel"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dialogue</Label>
        <Textarea
          value={panel.dialogue}
          onChange={handleDialogueChange}
          placeholder="Enter character dialogue..."
        />
      </div>

      {panel.generatedImage && (
        <div className="mt-4">
          <img
            src={panel.generatedImage}
            alt="Panel preview"
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}
    </Card>
  );
};

export default PanelEditor;