import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Character } from '@/types/character';

interface CharacterInputProps {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
}

const CharacterInput = ({ character, onCharacterUpdate }: CharacterInputProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onCharacterUpdate({
          ...character,
          referenceImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">Text Description</TabsTrigger>
        <TabsTrigger value="image">Reference Image</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <div className="space-y-2">
          <Label>Character Description</Label>
          <Textarea
            placeholder="Describe your character (e.g., 'a brave young girl with curly red hair and glasses')"
            value={character.description}
            onChange={(e) => onCharacterUpdate({
              ...character,
              description: e.target.value
            })}
            className="min-h-[100px]"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="image">
        <div className="space-y-2">
          <Label>Upload Reference Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          {character.referenceImage && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Reference Image Preview:</p>
              <img 
                src={character.referenceImage} 
                alt="Reference" 
                className="max-h-[200px] rounded-lg border"
              />
            </div>
          )}
          <Textarea
            placeholder="Optional: Add additional details or modifications to the reference image"
            value={character.description}
            onChange={(e) => onCharacterUpdate({
              ...character,
              description: e.target.value
            })}
            className="mt-4"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CharacterInput;