import React, { useState } from 'react';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Character } from '@/types/character';
import { ComicState } from '@/types/comic';
import { Panel } from '@/types/panel';
import { useProject } from '@/contexts/ProjectContext';
import ScriptGenerationContainer from './script/ScriptGenerationContainer';
import PanelManager from './script/PanelManager';
import ComicPreview from './comic/ComicPreview';

interface ScriptGeneratorProps {
  characters: Character[];
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ characters }) => {
  const { addProject } = useProject();
  const [script, setScript] = useState<{
    id: string;
    theme: string;
    tone: string;
    keyElements: string;
    panels: Panel[];
  } | null>(null);
  
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

  const handlePanelsReorder = (result: any) => {
    if (!result.destination) return;
    
    const newPages = [...comicState.pages];
    const [removed] = newPages[comicState.currentPage].panels.splice(result.source.index, 1);
    newPages[comicState.currentPage].panels.splice(result.destination.index, 0, removed);
    
    setComicState(prev => ({
      ...prev,
      pages: newPages
    }));
  };

  const handleScriptGenerated = (newScript: any, newPages: any[]) => {
    setScript(newScript);
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
      characters: characters.filter(char => 
        newScript.panels.some((panel: Panel) => panel.characters.includes(char.id))
      ),
      comicState: {
        ...comicState,
        pages: newPages
      },
      theme: newScript.theme,
      tone: newScript.tone,
      keyElements: newScript.keyElements,
    };
    
    addProject(newProject);
  };

  const handlePageChange = (newPage: number) => {
    setComicState(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handlePanelRegenerate = async (pageIndex: number, panelIndex: number) => {
    // Implementation will be added in the next iteration
    toast.error('Panel regeneration not implemented yet');
  };

  const handlePanelAdd = () => {
    if (!script) return;
    const newPanel = {
      id: crypto.randomUUID(),
      scene: '',
      dialogue: '',
      characters: [],
    };
    setScript({
      ...script,
      panels: [...script.panels, newPanel],
    });
    toast.success('New panel added');
  };

  const handlePanelUpdate = (index: number, updatedPanel: Panel) => {
    if (!script) return;
    const updatedPanels = [...script.panels];
    updatedPanels[index] = updatedPanel;
    setScript({
      ...script,
      panels: updatedPanels
    });
  };

  const handlePanelDelete = (index: number) => {
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
      <ScriptGenerationContainer
        characters={characters}
        onScriptGenerated={handleScriptGenerated}
        comicState={comicState}
        onComicStateChange={setComicState}
      />

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
            />
          </Card>

          <PanelManager
            panels={script.panels}
            selectedCharacters={script.panels.flatMap(p => p.characters)}
            onPanelsReorder={(newPanels) => {
              setScript({ ...script, panels: newPanels });
            }}
            onPanelUpdate={handlePanelUpdate}
            onPanelDelete={handlePanelDelete}
            onPanelAdd={handlePanelAdd}
          />
        </>
      )}
    </div>
  );
};

export default ScriptGenerator;
