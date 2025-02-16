import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { Character } from '@/types/character';

interface ProjectContextType {
  projects: Project[];
  characters: Character[];
  currentProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedCharacters = localStorage.getItem('characters');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
      
    }
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('characters', JSON.stringify(characters));
  }, [characters]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addCharacter = (character: Character) => {
    setCharacters(prev => [...prev, character]);
  };

  const updateCharacter = (character: Character) => {
    setCharacters(prev => prev.map(c => c.id === character.id ? character : c));
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        characters,
        currentProject,
        addProject,
        updateProject,
        deleteProject,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};