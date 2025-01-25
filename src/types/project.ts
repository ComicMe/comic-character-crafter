import { Character } from './character';
import { ComicState } from './comic';

export interface Project {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  characters: Character[];
  comicState: ComicState;
  theme: string;
  tone: string;
  keyElements: string;
}