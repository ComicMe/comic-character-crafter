import React from 'react';
import { Character } from '@/types/character';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Pencil, RefreshCw, Trash2 } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
  isGenerating: boolean;
}

const CharacterList = ({ characters, onEdit, onDelete, onRegenerate, isGenerating }: CharacterListProps) => {
  return (
    <ScrollArea className="h-[600px] w-full pr-4">
      <div className="space-y-4">
        {characters.map((character) => (
          <Card key={character.id} className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2 line-clamp-1">{character.description}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {character.referenceImage && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reference</p>
                      <img
                        src={character.referenceImage}
                        alt="Reference"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {character.generatedImage && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Generated</p>
                      <img
                        src={character.generatedImage}
                        alt="Generated"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(character.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRegenerate(character.id)}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(character.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CharacterList;