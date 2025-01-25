import { RunwareService } from './runware';
import { Panel } from '@/types/panel';
import { Character } from '@/types/character';

export const generatePanelImage = async (
  panel: Panel,
  characters: Character[],
  apiKey: string
) => {
  const runwareService = new RunwareService(apiKey);
  
  // Get characters in this panel
  const panelCharacters = characters.filter(char => 
    panel.characters.includes(char.id)
  );
  
  // Create a detailed prompt
  const characterDescriptions = panelCharacters
    .map(char => `${char.name}: ${char.description}`)
    .join('. ');

  const prompt = `Comic book panel scene: ${panel.scene}. 
    Characters present: ${characterDescriptions}. 
    Action/Dialogue context: "${panel.dialogue}".
    Style: Professional comic book art style, dynamic composition, clean lines, vibrant colors.
    Include appropriate background setting and character expressions based on the scene.`;

  try {
    const result = await runwareService.generateImage({
      positivePrompt: prompt,
      CFGScale: 7,
      numberResults: 1,
    });

    return {
      ...panel,
      generatedImage: result.imageURL,
    };
  } catch (error) {
    console.error('Panel generation error:', error);
    throw error;
  }
};