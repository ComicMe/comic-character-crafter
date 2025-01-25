import React, { useState } from 'react';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Character } from '@/types/character';
import { ComicSettings as ComicSettingsType, ComicState } from '@/types/comic';
import { Panel } from '@/types/panel';
import { RunwareService } from '@/services/runware';
import { useProject } from '@/contexts/ProjectContext';
import ScriptGenerationForm from './script/ScriptGenerationForm';
import PanelList from './script/PanelList';
import ComicPreview from './comic/ComicPreview';

interface ScriptGeneratorProps {
  characters: Character[];
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ characters }) => {
  const { addProject, updateProject } = useProject();
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('adventure');
  const [keyElements, setKeyElements] = useState('');
  const [script, setScript] = useState<{
    id: string;
    theme: string;
    tone: string;
    keyElements: string;
    panels: Panel[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [comicState, setComicState] = useState<ComicState>({
    settings: {
      totalPages: 1,
      panelsPerPage: 3,
      title: '',
    },
    pages: [],
    currentPage: 0,
  });

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
      setScript(newScript);
      
      // Save as new project
      const newProject = {
        id: crypto.randomUUID(),
        title: comicState.settings.title || 'Untitled Comic',
        createdAt: new Date(),
        updatedAt: new Date(),
        characters: characters.filter(char => selectedCharacters.includes(char.id)),
        comicState,
        theme,
        tone,
        keyElements,
      };
      addProject(newProject);
      
      toast.success('Script generated and project saved!');
    } catch (error) {
      toast.error('Failed to generate script');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsChange = (newSettings: ComicSettingsType) => {
    setComicState(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  const handlePageChange = (newPage: number) => {
    setComicState(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handlePanelRegenerate = async (pageIndex: number, panelIndex: number) => {
    if (!script || !apiKey) {
      toast.error('Please generate a script first and ensure API key is set');
      return;
    }

    try {
      const panel = script.panels[panelIndex];
      const selectedChars = characters.filter(char => panel.characters.includes(char.id));
      const charDescriptions = selectedChars.map(char => char.description).join(', ');
      
      const runwareService = new RunwareService(apiKey);
      const description = `Comic panel in ${tone} style: ${panel.scene}. Characters: ${charDescriptions}. Dialogue: ${panel.dialogue}. Highly detailed comic book art style, professional quality, dynamic composition.`;
      
      const result = await runwareService.generateImage({
        positivePrompt: description,
        CFGScale: 7,
        numberResults: 1,
      });

      const updatedPages = [...comicState.pages];
      if (updatedPages[pageIndex]) {
        const updatedPanels = [...updatedPages[pageIndex].panels];
        updatedPanels[panelIndex] = {
          ...updatedPanels[panelIndex],
          generatedImage: result.imageURL,
        };
        updatedPages[pageIndex].panels = updatedPanels;
      }

      setComicState(prev => ({
        ...prev,
        pages: updatedPages,
      }));
      
      toast.success('Panel regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate panel');
      console.error(error);
    }
  };

  const handlePanelsReorder = (newPanels: Panel[]) => {
    if (!script) return;
    setScript({
      ...script,
      panels: newPanels
    });
  };

  const handleUpdatePanel = (index: number, updatedPanel: Panel) => {
    if (!script) return;
    const updatedPanels = [...script.panels];
    updatedPanels[index] = updatedPanel;
    setScript({
      ...script,
      panels: updatedPanels
    });
  };

  const handleDeletePanel = (index: number) => {
    if (!script) return;
    const updatedPanels = script.panels.filter((_, i) => i !== index);
    setScript({
      ...script,
      panels: updatedPanels
    });
    toast.success('Panel deleted');
  };

  return (
    <div className="space-y-6">
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

      {script && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Comic Preview</h3>
            </div>
            
            <ComicPreview
              pages={comicState.pages}
              currentPage={comicState.currentPage}
              onPageChange={handlePageChange}
              onPanelRegenerate={handlePanelRegenerate}
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Script & Panels</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!script) return;
                  const newPanel = {
                    id: crypto.randomUUID(),
                    scene: '',
                    dialogue: '',
                    characters: selectedCharacters,
                  };
                  setScript({
                    ...script,
                    panels: [...script.panels, newPanel],
                  });
                  toast.success('New panel added');
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Panel
              </Button>
            </div>
            
            <PanelList
              panels={script.panels}
              onPanelsReorder={handlePanelsReorder}
              onRegeneratePanel={handlePanelRegenerate}
              onUpdatePanel={handleUpdatePanel}
              onDeletePanel={handleDeletePanel}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default ScriptGenerator;