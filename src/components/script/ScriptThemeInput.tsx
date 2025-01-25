import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ScriptThemeInputProps {
  theme: string;
  tone: string;
  keyElements: string;
  onThemeChange: (theme: string) => void;
  onToneChange: (tone: string) => void;
  onKeyElementsChange: (elements: string) => void;
}

const ScriptThemeInput = ({
  theme,
  tone,
  keyElements,
  onThemeChange,
  onToneChange,
  onKeyElementsChange,
}: ScriptThemeInputProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Theme</Label>
        <Input
          placeholder="Enter story theme"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
        />
      </div>

      <div>
        <Label>Tone</Label>
        <Select value={tone} onValueChange={onToneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="humorous">Humorous</SelectItem>
            <SelectItem value="dramatic">Dramatic</SelectItem>
            <SelectItem value="mysterious">Mysterious</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Key Elements</Label>
        <Textarea
          placeholder="Describe key story elements"
          value={keyElements}
          onChange={(e) => onKeyElementsChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ScriptThemeInput;