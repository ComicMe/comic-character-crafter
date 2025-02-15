import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
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
  regeneratingPanels: {[key: string]: boolean};
}

const ComicPreview = ({
  pages,
  currentPage,
  onPageChange,
  onPanelRegenerate,
  onPanelsReorder,
  title,
  author,
  regeneratingPanels
}: ComicPreviewProps) => {
  const currentPageData = pages[currentPage];

  const exportAsJPG = async () => {
    const element = document.getElementById('comic-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `${title || 'comic'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
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
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      
      // Add cover page with better formatting
      pdf.setFontSize(24);
      pdf.text(title, 105, 40, { align: 'center' });
      if (author) {
        pdf.setFontSize(16);
        pdf.text(`By ${author}`, 105, 50, { align: 'center' });
      }
      pdf.addPage();

      // Add comic pages with better quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 10, 10, pdfWidth - 20, pdfHeight - 20, undefined, 'FAST');

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
                            {regeneratingPanels[panel.id] ? (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                              </div>
                            ) : null}
                            {panel.scenesImage ? (
                              <img
                                src={panel.scenesImage}
                                alt={`Panel ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                                 {panel.text}
                              </div>
                            )}
                            <div 
                              className="absolute rounded-lg shadow-lg backdrop-blur-sm"
                              style={{
                                top: `${panel.dialoguePosition?.y || 10}%`,
                                left: `${panel.dialoguePosition?.x || 10}%`,
                                backgroundColor: `${panel.dialogueStyle?.backgroundColor || 'white'}`,
                                opacity: panel.dialogueStyle?.opacity || 0.9,
                                padding: '0.75rem',
                              }}
                            >
                              <p 
                                style={{ 
                                  fontSize: `${panel.dialogueStyle?.fontSize || 16}px`,
                                  color: panel.dialogueStyle?.textColor || 'black',
                                }}
                              >
                                {panel.text}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => onPanelRegenerate(currentPage, index)}
                            disabled={regeneratingPanels[panel.id]}
                          >
                            {regeneratingPanels[panel.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Regenerate'
                            )}
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
