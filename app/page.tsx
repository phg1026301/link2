'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LinkGrid } from './components/LinkGrid';
import { NewFolderModal } from './components/NewFolderModal';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>('all');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)]">
      <Header onNewFolderClick={() => setIsNewFolderModalOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedFolder={selectedFolder} onSelectFolder={setSelectedFolder} />
        <div className="flex-1 overflow-y-auto">
          <LinkGrid selectedFolder={selectedFolder} />
        </div>
      </div>
      <NewFolderModal isOpen={isNewFolderModalOpen} onClose={() => setIsNewFolderModalOpen(false)} />
    </div>
  );
}
