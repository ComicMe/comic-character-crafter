import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface ComicPreviewPanelProps {
  imageUrl?: string;
  dialogue: string;
  index: number;
  onRegenerate: () => void;
}

const ComicPreviewPanel = ({
  imageUrl,
  dialogue,
  index,
  onRegenerate,
}: ComicPreviewPanelProps) => {
  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Panel ${index + 1}`}
          className="w-full rounded-lg shadow-md"
        />
      ) : (
        <div className="bg-muted h-48 rounded-lg flex items-center justify-center">
          Panel {index + 1}
        </div>
      )}
      <div className="mt-2 text-sm text-center">
        {dialogue}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRegenerate}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ComicPreviewPanel;