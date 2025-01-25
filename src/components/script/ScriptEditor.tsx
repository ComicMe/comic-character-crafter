import React from 'react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ScriptEditorProps {
  scene: string;
  dialogue: string;
  onSceneChange: (scene: string) => void;
  onDialogueChange: (dialogue: string) => void;
  onUpdate: () => void;
}

const ScriptEditor = ({
  scene,
  dialogue,
  onSceneChange,
  onDialogueChange,
  onUpdate,
}: ScriptEditorProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Scene Description</Label>
        <Textarea
          value={scene}
          onChange={(e) => onSceneChange(e.target.value)}
          placeholder="Describe the scene..."
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Dialogue</Label>
        <Textarea
          value={dialogue}
          onChange={(e) => onDialogueChange(e.target.value)}
          placeholder="Enter character dialogue..."
        />
      </div>
      <Button onClick={onUpdate} className="w-full">
        Update Panel
      </Button>
    </Card>
  );
};

export default ScriptEditor;