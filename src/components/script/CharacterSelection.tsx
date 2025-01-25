import React from 'react';
import { Button } from '../ui/button';
import { Character } from '@/types/character';

interface CharacterSelectionProps {
  characters: Character[];
  selectedCharacters: string[];
  onCharacterSelect: (characterIds: string[]) => void;
}

const CharacterSelection = ({
  characters,
  selectedCharacters,
  onCharacterSelect,
}: CharacterSelectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Select Characters</h3>
      <div className="flex flex-wrap gap-2">
        {characters.map((char) => (
          <Button
            key={char.id}
            variant={selectedCharacters.includes(char.id) ? "default" : "outline"}
            onClick={() => {
              onCharacterSelect(
                selectedCharacters.includes(char.id)
                  ? selectedCharacters.filter(id => id !== char.id)
                  : [...selectedCharacters, char.id]
              );
            }}
            className="flex items-center gap-2"
          >
            {char.description.slice(0, 20)}...
            {char.generatedImage && (
              <img
                src={char.generatedImage}
                alt="Character thumbnail"
                className="w-6 h-6 rounded-full"
              />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;