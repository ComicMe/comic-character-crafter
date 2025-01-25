export interface ComicPage {
  id: string;
  panels: Panel[];
}

export interface ComicSettings {
  totalPages: number;
  panelsPerPage: number;
  title: string;
  author?: string;
}

export interface ComicState {
  settings: ComicSettings;
  pages: ComicPage[];
  currentPage: number;
}