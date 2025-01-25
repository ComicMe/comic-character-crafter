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
          <ScriptGenerator characters={characters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;