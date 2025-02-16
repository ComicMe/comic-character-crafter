export interface DialogueStyle {
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  opacity: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Panel {
  scenesImage?: string;
  text ? : string;
  id: string;
  scene: string;
  dialogue: string;
  characters: string[];
  generatedImage?: string;
  dialogueSize?: number;
  dialoguePosition?: Position;
  dialogueStyle?: DialogueStyle;
}