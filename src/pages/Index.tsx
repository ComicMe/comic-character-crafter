import { useState } from 'react';
import CharacterGenerator from "@/components/CharacterGenerator";
import ScriptGenerator from "@/components/ScriptGenerator";
import ProjectLibrary from "@/components/project/ProjectLibrary";
import { Character } from "@/types/character";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from '@/contexts/ProjectContext';

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const { projects } = useProject();

  const handleCharacterUpdate = (updatedCharacters: Character[]) => {
    setCharacters(updatedCharacters);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Comic Creator Studio</h1>
      
      <Tabs defaultValue="characters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="script">Script & Panels</TabsTrigger>
          <TabsTrigger value="library">Project Library</TabsTrigger>
        </TabsList>

        <TabsContent value="characters">
          <CharacterGenerator onCharactersUpdate={handleCharacterUpdate} />
        </TabsContent>

        <TabsContent value="script">
          <ScriptGenerator characters={characters} />
        </TabsContent>

        <TabsContent value="library">
          <ProjectLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;