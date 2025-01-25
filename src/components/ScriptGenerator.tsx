import React, { useState } from 'react';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
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
  const { addProject } = useProject();
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
  const [regeneratingPanels, setRegeneratingPanels] = useState<{[key: string]: boolean}>({});
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [formErrors, setFormErrors] = useState<{
    theme?: string;
    keyElements?: string;
    characters?: string;
    apiKey?: string;
  }>({});
  const [comicState, setComicState] = useState<ComicState>({
    settings: {
      totalPages: 1,
      panelsPerPage: 3,
      title: '',
      author: '',
    },
    pages: [],
    currentPage: 0,
  });

  const validateForm = () => {
    const errors: typeof formErrors = {};
    
    if (!theme.trim()) {
      errors.theme = 'Theme is required';
    }
    if (!keyElements.trim()) {
      errors.keyElements = 'Key elements are required';
    }
    if (selectedCharacters.length === 0) {
      errors.characters = 'At least one character must be selected';
    }
    if (!apiKey.trim()) {
      errors.apiKey = 'Runware API key is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePanelsReorder = (result: any) => {
    if (!result.destination) return;
    
    if (result.type === 'preview') {
      const newPages = [...comicState.pages];
      const [removed] = newPages[comicState.currentPage].panels.splice(result.source.index, 1);
      newPages[comicState.currentPage].panels.splice(result.destination.index, 0, removed);
      
      setComicState(prev => ({
        ...prev,
        pages: newPages
      }));
    } else if (result.type === 'script' && script) {
      const newPanels = [...script.panels];
      const [removed] = newPanels.splice(result.source.index, 1);
      newPanels.splice(result.destination.index, 0, removed);
      
      setScript({
        ...script,
        panels: newPanels
      });
    }
  };

  const generateScript = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before generating');
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
      
      // Initialize comic pages
      const newPages = [{
        id: crypto.randomUUID(),
        panels: newScript.panels.map(panel => ({
          ...panel,
          generatedImage: undefined,
          dialogueSize: 16
        }))
      }];
      
      setComicState(prev => ({
        ...prev,
        pages: newPages
      }));
      
      // Save as new project
      const newProject = {
        id: crypto.randomUUID(),
        title: comicState.settings.title || 'Untitled Comic',
        createdAt: new Date(),
        updatedAt: new Date(),
        characters: characters.filter(char => selectedCharacters.includes(char.id)),
        comicState: {
          ...comicState,
          pages: newPages
        },
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

  const handlePanelRegenerate = async (pageIndex: number, panelIndex: number) => {
    if (!script || !apiKey) {
      toast.error('Please generate a script first and ensure API key is set');
      return;
    }

    const panelId = script.panels[panelIndex].id;
    setRegeneratingPanels(prev => ({ ...prev, [panelId]: true }));

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
    } finally {
      setRegeneratingPanels(prev => ({ ...prev, [panelId]: false }));
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

  const handleUpdatePanel = (index: number, updatedPanel: Panel) => {
    if (!script) return;
    const updatedPanels = [...script.panels];
    updatedPanels[index] = {
      ...updatedPanel,
      dialoguePosition: updatedPanel.dialoguePosition || { x: 10, y: 10 },
      dialogueStyle: updatedPanel.dialogueStyle || {
        fontSize: 16,
        backgroundColor: 'white',
        textColor: 'black',
        opacity: 0.9,
      }
    };
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
              className={`w-full px-3 py-2 border rounded-md mb-4 ${
                formErrors.apiKey ? 'border-red-500' : ''
              }`}
            />
            {formErrors.apiKey && (
              <p className="text-red-500 text-sm mt-1">{formErrors.apiKey}</p>
            )}
          </div>

          <ScriptGenerationForm
            theme={theme}
            tone={tone}
            keyElements={keyElements}
            selectedCharacters={selectedCharacters}
            isGenerating={isGenerating}
            comicSettings={comicState.settings}
            characters={characters}
            formErrors={formErrors}
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
              onPanelsReorder={handlePanelsReorder}
              title={comicState.settings.title || "Untitled Comic"}
              author={comicState.settings.author}
              regeneratingPanels={regeneratingPanels}
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
                    dialoguePosition: { x: 10, y: 10 },
                    dialogueStyle: {
                      fontSize: 16,
                      backgroundColor: 'white',
                      textColor: 'black',
                      opacity: 0.9,
                    }
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
              regeneratingPanels={regeneratingPanels}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default ScriptGenerator;
