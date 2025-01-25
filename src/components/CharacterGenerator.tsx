import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { RunwareService } from '@/services/runware';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Character } from '@/types/character';
import CharacterList from './CharacterList';
import { Plus } from 'lucide-react';

interface CharacterGeneratorProps {
  onCharactersUpdate?: (characters: Character[]) => void;
}

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({ onCharactersUpdate }) => {
  const [apiKey, setApiKey] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character>({
    id: crypto.randomUUID(),
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCharacter(prev => ({
          ...prev,
          referenceImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGeneration = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }

    if (!currentCharacter.description && !currentCharacter.referenceImage) {
      toast.error('Please provide either a description or a reference image');
      return;
    }

    setIsGenerating(true);
    const runwareService = new RunwareService(apiKey);

    try {
      let prompt = currentCharacter.description;
      if (currentCharacter.referenceImage) {
        prompt = `Transform this reference image into a comic book style character. ${currentCharacter.description ? 'Additional details: ' + currentCharacter.description : ''}`;
      } else {
        prompt = `Create a comic book style character: ${currentCharacter.description}. Highly detailed, professional comic art style, full body shot, clean lines, vibrant colors.`;
      }
      
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        seed: currentCharacter.seed,
        CFGScale: 7,
        numberResults: 1,
      });

      const updatedCharacter = {
        ...currentCharacter,
        generatedImage: result.imageURL,
        seed: result.seed,
      };

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
    if (character) {
      setCurrentCharacter(character);
      setIsEditing(true);
      await handleImageGeneration();
    }
  };

  const resetCurrentCharacter = () => {
    setCurrentCharacter({
      id: crypto.randomUUID(),
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
                    value={currentCharacter.description}
                    onChange={(e) => setCurrentCharacter(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
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
                  {currentCharacter.referenceImage && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Reference Image Preview:</p>
                      <img 
                        src={currentCharacter.referenceImage} 
                        alt="Reference" 
                        className="max-h-[200px] rounded-lg border"
                      />
                    </div>
                  )}
                  <Textarea
                    placeholder="Optional: Add additional details or modifications to the reference image"
                    value={currentCharacter.description}
                    onChange={(e) => setCurrentCharacter(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    className="mt-4"
                  />
                </div>
              </TabsContent>
            </Tabs>

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
