import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Character } from '@/types/character';
import ScriptThemeInput from './script/ScriptThemeInput';
import CharacterSelection from './script/CharacterSelection';
import PanelList from './script/PanelList';
import { RunwareService } from '@/services/runware';

interface Panel {
  id: string;
  scene: string;
  dialogue: string;
  characters: string[];
  generatedImage?: string;
}

interface Script {
  id: string;
  theme: string;
  tone: string;
  keyElements: string;
  panels: Panel[];
}

interface ScriptGeneratorProps {
  characters: Character[];
  onGeneratePanel: (description: string) => Promise<string>;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ characters }) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('adventure');
  const [keyElements, setKeyElements] = useState('');
  const [script, setScript] = useState<Script | null>(null);
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
      // Here you would integrate with an AI service to generate the script
      const newScript: Script = {
        id: crypto.randomUUID(),
        theme,
        tone,
        keyElements,
        panels: [
          {
            id: crypto.randomUUID(),
            scene: 'Opening scene: ' + keyElements,
            dialogue: 'Character: "Our adventure begins here!"',
            characters: selectedCharacters,
          },
          {
            id: crypto.randomUUID(),
            scene: 'Action sequence in ' + keyElements,
            dialogue: 'Character: "We must hurry!"',
            characters: selectedCharacters,
          },
        ],
      };
      setScript(newScript);
      toast.success('Script generated successfully!');
    } catch (error) {
      toast.error('Failed to generate script');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePanelImage = async (panelIndex: number) => {
    if (!script || !apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }
    
    const panel = script.panels[panelIndex];
    const selectedChars = characters.filter(char => panel.characters.includes(char.id));
    const charDescriptions = selectedChars.map(char => char.description).join(', ');
    
    try {
      const runwareService = new RunwareService(apiKey);
      const description = `Comic panel in ${tone} style: ${panel.scene}. Characters: ${charDescriptions}. Dialogue: ${panel.dialogue}`;
      
      const result = await runwareService.generateImage({
        positivePrompt: description,
        CFGScale: 7,
        numberResults: 1,
      });
      
      const updatedPanels = [...script.panels];
      updatedPanels[panelIndex] = {
        ...panel,
        generatedImage: result.imageURL,
      };
      
      setScript({
        ...script,
        panels: updatedPanels,
      });
    } catch (error) {
      toast.error('Failed to generate panel image');
      console.error(error);
    }
  };

  const handlePanelsReorder = (newPanels: Panel[]) => {
    if (!script) return;
    setScript({
      ...script,
      panels: newPanels,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Story Generator</h2>
        
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

          <ScriptThemeInput
            theme={theme}
            tone={tone}
            keyElements={keyElements}
            onThemeChange={setTheme}
            onToneChange={setTone}
            onKeyElementsChange={setKeyElements}
          />

          <CharacterSelection
            characters={characters}
            selectedCharacters={selectedCharacters}
            onCharacterSelect={setSelectedCharacters}
          />

          <Button
            onClick={generateScript}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              'Generate Script'
            )}
          </Button>
        </div>
      </Card>

      {script && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Generated Script</h3>
          <PanelList
            panels={script.panels}
            onPanelsReorder={handlePanelsReorder}
            onRegeneratePanel={generatePanelImage}
          />
        </Card>
      )}
    </div>
  );
};

export default ScriptGenerator;