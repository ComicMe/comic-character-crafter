import { useState } from 'react';
import CharacterGenerator from "@/components/CharacterGenerator";
import ScriptGenerator from "@/components/ScriptGenerator";
import { Character } from "@/types/character";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const handleCharacterUpdate = (updatedCharacters: Character[]) => {
    setCharacters(updatedCharacters);
  };

  const handlePanelGeneration = async (description: string) => {
    // This would integrate with your image generation service
    // For now, we'll return a placeholder
    return "https://via.placeholder.com/400x300";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Comic Creator Studio</h1>
      
      <Tabs defaultValue="characters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="script">Script & Panels</TabsTrigger>
        </TabsList>

        <TabsContent value="characters">
          <CharacterGenerator onCharactersUpdate={handleCharacterUpdate} />
        </TabsContent>

        <TabsContent value="script">
          <ScriptGenerator
            characters={characters}
            onGeneratePanel={handlePanelGeneration}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;