import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { RunwareService } from '@/services/runware';
import { Label } from './ui/label';
import { Character } from '@/types/character';
import CharacterList from './CharacterList';
import CharacterInput from './character/CharacterInput';
import { Plus } from 'lucide-react';

interface CharacterGeneratorProps {
  onCharactersUpdate?: (characters: Character[]) => void;
}

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({ onCharactersUpdate }) => {
  const [apiKey, setApiKey] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const generateCharacterImage = async (character: Character) => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return null;
    }

    const runwareService = new RunwareService(apiKey);
    let prompt = character.description;
    
    if (character.referenceImage) {
      prompt = `Transform this reference image into a comic book style character named ${character.name}. ${character.description ? 'Additional details: ' + character.description : ''}`;
    } else {
      prompt = `Create a comic book style character named ${character.name}: ${character.description}. Highly detailed, professional comic art style, full body shot, clean lines, vibrant colors.`;
    }
    
    const result = await runwareService.generateImage({
      positivePrompt: prompt,
      seed: character.seed,
      CFGScale: 7,
      numberResults: 1,
    });

    return {
      ...character,
      generatedImage: result.imageURL,
      seed: result.seed,
    };
  };

  const handleImageGeneration = async () => {
    if (!currentCharacter.name) {
      toast.error('Please provide a character name');
      return;
    }

    if (!currentCharacter.description && !currentCharacter.referenceImage) {
      toast.error('Please provide either a description or a reference image');
      return;
    }

    setIsGenerating(true);

    try {
      const updatedCharacter = await generateCharacterImage(currentCharacter);
      
      if (updatedCharacter) {
        if (isEditing) {
          const updatedCharacters = characters.map(char => 
            char.id === currentCharacter.id ? updatedCharacter : char
          );
          setCharacters(updatedCharacters);
          onCharactersUpdate?.(updatedCharacters);
        } else {
          const newCharacters = [...characters, updatedCharacter];
          setCharacters(newCharacters);
          onCharactersUpdate?.(newCharacters);
        }
      }

      resetCurrentCharacter();
      toast.success('Character generated successfully!');
    } catch (error) {
      toast.error('Failed to generate character. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
      setIsEditing(false);
    }
  };

  const handleEdit = (id: string) => {
    const character = characters.find(char => char.id === id);
    if (character) {
      setCurrentCharacter(character);
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    const updatedCharacters = characters.filter(char => char.id !== id);
    setCharacters(updatedCharacters);
    onCharactersUpdate?.(updatedCharacters);
    toast.success('Character deleted');
  };

  const handleRegenerate = async (id: string) => {
    const character = characters.find(char => char.id === id);
    if (!character) return;

    setIsGenerating(true);
    try {
      const updatedCharacter = await generateCharacterImage(character);
      if (updatedCharacter) {
        const updatedCharacters = characters.map(char => 
          char.id === id ? updatedCharacter : char
        );
        setCharacters(updatedCharacters);
        onCharactersUpdate?.(updatedCharacters);
        toast.success('Character regenerated successfully!');
      }
    } catch (error) {
      toast.error('Failed to regenerate character. Please try again.');
      console.error('Regeneration error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetCurrentCharacter = () => {
    setCurrentCharacter({
      id: crypto.randomUUID(),
      name: '',
      description: '',
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-6">Comic Character Generator</h1>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Runware API Key</Label>
              <Input
                type="password"
                placeholder="Enter your Runware API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <CharacterInput
              character={currentCharacter}
              onCharacterUpdate={setCurrentCharacter}
            />

            <div className="flex gap-4">
              <Button 
                onClick={handleImageGeneration} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? 'Generating...' : isEditing ? 'Update Character' : 'Generate Character'}
              </Button>
              
              {isEditing && (
                <Button 
                  onClick={resetCurrentCharacter}
                  variant="outline"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Characters</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCurrentCharacter}
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Character
            </Button>
          </div>
          
          <CharacterList
            characters={characters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRegenerate={handleRegenerate}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterGenerator;