import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { ComicPage } from '@/types/comic';
import html2canvas from 'html2canvas';

interface ComicExporterProps {
  pages: ComicPage[];
  title: string;
}

const ComicExporter: React.FC<ComicExporterProps> = ({ pages, title }) => {
  const exportComic = async () => {
    const comicElement = document.getElementById('comic-pages');
    if (!comicElement) return;

    try {
      const canvas = await html2canvas(comicElement);
      const link = document.createElement('a');
      link.download = `${title || 'comic'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <Button
      onClick={exportComic}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export Comic
    </Button>
  );
};

export default ComicExporter;