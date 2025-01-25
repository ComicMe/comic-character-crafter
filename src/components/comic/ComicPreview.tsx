import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComicPage } from '@/types/comic';
import { Panel } from '@/types/panel';

interface ComicPreviewProps {
  pages: ComicPage[];
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  onPanelRegenerate: (pageIndex: number, panelIndex: number) => void;
}

const ComicPreview = ({
  pages,
  currentPage,
  onPageChange,
  onPanelRegenerate
}: ComicPreviewProps) => {
  const currentPageData = pages[currentPage];

  if (!currentPageData) {
    return <div>No pages available</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span>
            Page {currentPage + 1} of {pages.length}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentPageData.panels.map((panel, index) => (
            <div key={panel.id} className="relative">
              {panel.generatedImage ? (
                <img
                  src={panel.generatedImage}
                  alt={`Panel ${index + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="bg-muted h-48 rounded-lg flex items-center justify-center">
                  Panel {index + 1}
                </div>
              )}
              <div className="mt-2 text-sm text-center">
                {panel.dialogue}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onPanelRegenerate(currentPage, index)}
              >
                Regenerate
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ComicPreview;