import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Character } from '@/types/character';
import { Loader2, Plus, RefreshCw, X } from 'lucide-react';

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

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ characters, onGeneratePanel }) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('adventure');
  const [keyElements, setKeyElements] = useState('');
  const [script, setScript] = useState<Script | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

  const generateScript = async () => {
    if (!theme || !keyElements || selectedCharacters.length === 0) {
      toast.error('Please fill in all required fields and select at least one character');
      return;
    }

    setIsGenerating(true);
    try {
      // Here you would integrate with an AI service to generate the script
      // For now, we'll create a simple example script
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
    if (!script) return;
    
    const panel = script.panels[panelIndex];
    try {
      const description = `Comic panel: ${panel.scene} - ${panel.dialogue}`;
      const imageUrl = await onGeneratePanel(description);
      
      const updatedPanels = [...script.panels];
      updatedPanels[panelIndex] = {
        ...panel,
        generatedImage: imageUrl,
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

  const handleDragEnd = (result: any) => {
    if (!result.destination || !script) return;

    const items = Array.from(script.panels);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setScript({
      ...script,
      panels: items,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Story Generator</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Theme</Label>
            <Input
              placeholder="Enter story theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>

          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
                <SelectItem value="mysterious">Mysterious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Key Elements</Label>
            <Textarea
              placeholder="Describe key story elements"
              value={keyElements}
              onChange={(e) => setKeyElements(e.target.value)}
            />
          </div>

          <div>
            <Label>Select Characters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {characters.map((char) => (
                <Button
                  key={char.id}
                  variant={selectedCharacters.includes(char.id) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCharacters(prev =>
                      prev.includes(char.id)
                        ? prev.filter(id => id !== char.id)
                        : [...prev, char.id]
                    );
                  }}
                  className="flex items-center gap-2"
                >
                  {char.description.slice(0, 20)}...
                  {char.generatedImage && (
                    <img
                      src={char.generatedImage}
                      alt="Character thumbnail"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

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
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="panels">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {script.panels.map((panel, index) => (
                    <Draggable
                      key={panel.id}
                      draggableId={panel.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border rounded-lg p-4 bg-background"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Panel {index + 1}</h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generatePanelImage(index)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">{panel.scene}</p>
                          <p className="text-sm italic mb-2">{panel.dialogue}</p>
                          
                          {panel.generatedImage && (
                            <img
                              src={panel.generatedImage}
                              alt={`Panel ${index + 1}`}
                              className="w-full h-48 object-cover rounded-md mt-2"
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default ScriptGenerator;