import React, { useState } from 'react';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { Character } from '@/types/character';
import { ComicSettings, ComicState } from '@/types/comic';
import ScriptGenerationForm from './ScriptGenerationForm';
import { Panel } from '@/types/panel';
import { RunwareService } from '@/services/runware';

interface ScriptGenerationContainerProps {
  characters: Character[];
  onScriptGenerated: (script: any, pages: any[]) => void;
  comicState: ComicState;
  onComicStateChange: (state: ComicState) => void;
}

const ScriptGenerationContainer: React.FC<ScriptGenerationContainerProps> = ({
  characters,
  onScriptGenerated,
  comicState,
  onComicStateChange,
}) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('adventure');
  const [keyElements, setKeyElements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');

  const generateScript = async () => {
    if (!theme || !keyElements || selectedCharacters.length === 0) {
      toast.error('Please fill in all required fields and select at least one character');
      return;
    }

    setIsGenerating(true);
    try {
      const newScript = {
        id: crypto.randomUUID(),
        theme,
        tone,
        keyElements,
        panels: [
          {
            id: crypto.randomUUID(),
            scene: `Opening scene in ${keyElements}`,
            dialogue: 'Character: "Our story begins..."',
            characters: selectedCharacters,
          },
          {
            id: crypto.randomUUID(),
            scene: `Action sequence in ${keyElements}`,
            dialogue: 'Character: "We must hurry!"',
            characters: selectedCharacters,
          },
        ],
      };

      const newPages = [{
        id: crypto.randomUUID(),
        panels: newScript.panels.map(panel => ({
          ...panel,
          generatedImage: undefined,
          dialogueSize: 16
        }))
      }];

      onScriptGenerated(newScript, newPages);
      toast.success('Script generated successfully!');
    } catch (error) {
      toast.error('Failed to generate script');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsChange = (newSettings: ComicSettings) => {
    onComicStateChange({
      ...comicState,
      settings: newSettings
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Comic Generator</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Enter your Runware API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
          />
        </div>

        <ScriptGenerationForm
          theme={theme}
          tone={tone}
          keyElements={keyElements}
          selectedCharacters={selectedCharacters}
          isGenerating={isGenerating}
          comicSettings={comicState.settings}
          characters={characters}
          onThemeChange={setTheme}
          onToneChange={setTone}
          onKeyElementsChange={setKeyElements}
          onCharacterSelect={setSelectedCharacters}
          onSettingsChange={handleSettingsChange}
          onGenerate={generateScript}
        />
      </div>
    </Card>
  );
};

export default ScriptGenerationContainer;