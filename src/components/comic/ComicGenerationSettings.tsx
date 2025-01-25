import React from 'react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import type { ComicSettings } from '@/types/comic';

interface ComicGenerationSettingsProps {
  settings: ComicSettings;
  onSettingsChange: (settings: ComicSettings) => void;
  onExport: (format: 'pdf' | 'jpg') => void;
}

const ComicGenerationSettings = ({
  settings,
  onSettingsChange,
  onExport
}: ComicGenerationSettingsProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Comic Title</Label>
        <Input
          id="title"
          value={settings.title}
          onChange={(e) => onSettingsChange({ ...settings, title: e.target.value })}
          placeholder="Enter comic title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={settings.author || ''}
          onChange={(e) => onSettingsChange({ ...settings, author: e.target.value })}
          placeholder="Enter author name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalPages">Total Pages</Label>
        <Input
          id="totalPages"
          type="number"
          min={1}
          max={20}
          value={settings.totalPages}
          onChange={(e) => onSettingsChange({ ...settings, totalPages: Math.max(1, Math.min(20, Number(e.target.value))) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="panelsPerPage">Panels Per Page</Label>
        <Input
          id="panelsPerPage"
          type="number"
          min={1}
          max={6}
          value={settings.panelsPerPage}
          onChange={(e) => onSettingsChange({ ...settings, panelsPerPage: Math.max(1, Math.min(6, Number(e.target.value))) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Export Format</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onExport('pdf')}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport('jpg')}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as JPG
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ComicGenerationSettings;