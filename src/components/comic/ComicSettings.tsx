import React from 'react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { ComicSettings } from '@/types/comic';

interface ComicSettingsProps {
  settings: ComicSettings;
  onSettingsChange: (settings: ComicSettings) => void;
}

const ComicSettingsComponent = ({ settings, onSettingsChange }: ComicSettingsProps) => {
  const handleChange = (field: keyof ComicSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: typeof value === 'string' ? value : Math.max(1, Math.min(20, Number(value)))
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Comic Title</Label>
        <Input
          id="title"
          value={settings.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter comic title"
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
          onChange={(e) => handleChange('totalPages', e.target.value)}
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
          onChange={(e) => handleChange('panelsPerPage', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author (Optional)</Label>
        <Input
          id="author"
          value={settings.author || ''}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Enter author name"
        />
      </div>
    </Card>
  );
};

export default ComicSettingsComponent;