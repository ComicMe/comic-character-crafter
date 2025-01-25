export interface Character {
  id: string;
  name: string;
  description: string;
  referenceImage?: string;
  generatedImage?: string;
  seed?: number;
}