import React from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import ScriptThemeInput from './ScriptThemeInput';
import CharacterSelection from './CharacterSelection';
import { Character } from '@/types/character';
import { ComicSettings } from '@/types/comic';
import ComicSettingsComponent from '../comic/ComicSettings';

interface ScriptGenerationFormProps {
  theme: string;
  tone: string;
  keyElements: string;
  selectedCharacters: string[];
  isGenerating: boolean;
  comicSettings: ComicSettings;
  characters: Character[];
  formErrors?: {
    theme?: string;
    keyElements?: string;
    characters?: string;
    apiKey?: string;
  };
  onThemeChange: (theme: string) => void;
  onToneChange: (tone: string) => void;
  onKeyElementsChange: (elements: string) => void;
  onCharacterSelect: (characters: string[]) => void;
  onSettingsChange: (settings: ComicSettings) => void;
  onGenerate: () => void;
}

const ScriptGenerationForm = ({
  theme,
  tone,
  keyElements,
  selectedCharacters,
  isGenerating,
  comicSettings,
  characters,
  formErrors = {},
  onThemeChange,
  onToneChange,
  onKeyElementsChange,
  onCharacterSelect,
  onSettingsChange,
  onGenerate,
}: ScriptGenerationFormProps) => {
  return (
    <div className="space-y-4">
      <ComicSettingsComponent
        settings={comicSettings}
        onSettingsChange={onSettingsChange}
      />

      <ScriptThemeInput
        theme={theme}
        tone={tone}
        keyElements={keyElements}
        onThemeChange={onThemeChange}
        onToneChange={onToneChange}
        onKeyElementsChange={onKeyElementsChange}
      />

      <CharacterSelection
        characters={characters}
        selectedCharacters={selectedCharacters}
        onCharacterSelect={onCharacterSelect}
      />

      {Object.values(formErrors).map((error, index) => (
        error && <p key={index} className="text-red-500 text-sm">{error}</p>
      ))}

      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Comic...
          </>
        ) : (
          'Generate Comic'
        )}
      </Button>
    </div>
  );
};

export default ScriptGenerationForm;