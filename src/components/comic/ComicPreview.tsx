import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { ComicPage } from '@/types/comic';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ComicPreviewProps {
  pages: ComicPage[];
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  onPanelRegenerate: (pageIndex: number, panelIndex: number) => void;
  onPanelsReorder: (result: any) => void;
  title: string;
  author?: string;
}

const ComicPreview = ({
  pages,
  currentPage,
  onPageChange,
  onPanelRegenerate,
  onPanelsReorder,
  title,
  author
}: ComicPreviewProps) => {
  const currentPageData = pages[currentPage];

  const exportAsJPG = async () => {
    const element = document.getElementById('comic-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `${title || 'comic'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
      toast.success('Comic exported as JPG successfully!');
    } catch (error) {
      toast.error('Failed to export comic');
      console.error('Export error:', error);
    }
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('comic-preview');
    if (!element) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add cover page
      pdf.setFontSize(24);
      pdf.text(title, 105, 40, { align: 'center' });
      if (author) {
        pdf.setFontSize(16);
        pdf.text(`By ${author}`, 105, 50, { align: 'center' });
      }
      pdf.addPage();

      // Add comic pages
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/jpeg');
      pdf.addImage(imgData, 'JPEG', 10, 10, 190, 277);

      pdf.save(`${title || 'comic'}.pdf`);
      toast.success('Comic exported as PDF successfully!');
    } catch (error) {
      toast.error('Failed to export comic');
      console.error('Export error:', error);
    }
  };

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
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={exportAsJPG}>
              <Download className="h-4 w-4 mr-2" />
              Export JPG
            </Button>
            <Button variant="outline" onClick={exportAsPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div id="comic-preview" className="bg-white p-4 rounded-lg">
          <DragDropContext onDragEnd={onPanelsReorder}>
            <Droppable droppableId={`page-${currentPage}`}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 gap-4"
                >
                  {currentPageData.panels.map((panel, index) => (
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
                          className="relative"
                        >
                          <div className="relative aspect-video">
                            {panel.generatedImage ? (
                              <img
                                src={panel.generatedImage}
                                alt={`Panel ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                                Panel {index + 1}
                              </div>
                            )}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                              <p 
                                className="text-black"
                                style={{ fontSize: `${panel.dialogueSize || 16}px` }}
                              >
                                {panel.dialogue}
                              </p>
                            </div>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Card>
  );
};

export default ComicPreview;