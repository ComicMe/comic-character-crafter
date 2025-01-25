import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Panel } from '@/types/panel';

interface ComicPanelGeneratorProps {
  panel: Panel;
  onRegenerate: () => void;
  isGenerating: boolean;
}

const ComicPanelGenerator: React.FC<ComicPanelGeneratorProps> = ({
  panel,
  onRegenerate,
  isGenerating,
}) => {
  return (
    <Card className="relative">
      <div className="aspect-video relative">
        {panel.generatedImage ? (
          <div className="relative w-full h-full">
            <img
              src={panel.generatedImage}
              alt={panel.scene}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {/* Dialogue bubble */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
              <p className="text-black" style={{ fontSize: `${panel.dialogueSize || 16}px` }}>
                {panel.dialogue}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            No image generated
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm text-muted-foreground">{panel.scene}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Regenerate Panel'}
        </Button>
      </div>
    </Card>
  );
};

export default ComicPanelGenerator;