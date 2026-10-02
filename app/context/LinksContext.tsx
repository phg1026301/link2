'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon?: string;
  folder: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
}

interface LinksContextType {
  links: Link[];
  folders: Folder[];
  addLink: (link: Omit<Link, 'id'>) => Link;
  deleteLink: (id: string) => void;
  addFolder: (name: string, icon?: string) => Folder;
  deleteFolder: (id: string) => void;
  editFolder: (id: string, name: string) => void;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'all', name: 'All', icon: '📋' },
];

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [folders, setFolders] = useState<Folder[]>(DEFAULT_FOLDERS);

  const addLink = (link: Omit<Link, 'id'>): Link => {
    const newLink: Link = {
      ...link,
      id: Date.now().toString(),
    };
    setLinks((prev) => [...prev, newLink]);
    return newLink;
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const addFolder = (name: string, icon: string = '📁'): Folder => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      icon,
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  const editFolder = (id: string, name: string) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, name } : folder))
    );
  };

  return (
    <LinksContext.Provider value={{ links, folders, addLink, deleteLink, addFolder, deleteFolder, editFolder }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within LinksProvider');
  }
  return context;
}
