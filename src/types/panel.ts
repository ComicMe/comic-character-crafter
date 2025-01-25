export interface Panel {
  id: string;
  scene: string;
  dialogue: string;
  characters: string[];
  generatedImage?: string;
  dialogueSize?: number;
}