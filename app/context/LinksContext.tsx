'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';

export interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon?: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
}

interface BookmarkRow {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon: string | null;
  folder_id: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
}

interface LinksContextType {
  // undefined: 세션 확인 전, null: 로그아웃 상태
  user: AuthUser | null | undefined;
  signOut: () => Promise<void>;
  links: Link[];
  folders: Folder[];
  isLoading: boolean;
  addLink: (link: Omit<Link, 'id'>) => Promise<Link>;
  deleteLink: (id: string) => Promise<void>;
  addFolder: (name: string, icon?: string) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  editFolder: (id: string, name: string) => Promise<void>;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const ALL_FOLDER: Folder = { id: 'all', name: 'All', icon: '📋' };

const supabase = createClient();

const toLink = (row: BookmarkRow): Link => ({
  id: row.id,
  title: row.title,
  description: row.description,
  url: row.url,
  favicon: row.favicon ?? undefined,
  folderId: row.folder_id,
});

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [folders, setFolders] = useState<Folder[]>([ALL_FOLDER]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  // 현재 데이터를 불러온 사용자 (undefined: 세션 확인 전, null: 로그아웃 상태)
  const loadedUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const loadUserData = async (userId: string | null) => {
      if (userId === null) {
        setFolders([ALL_FOLDER]);
        setLinks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const [foldersRes, bookmarksRes] = await Promise.all([
        supabase.from('folders').select('id, name, icon').order('created_at').order('id'),
        supabase
          .from('bookmarks')
          .select('id, title, description, url, favicon, folder_id')
          .order('created_at', { ascending: false }),
      ]);
      // 불러오는 사이 다른 사용자로 바뀌었으면 결과 무시
      if (loadedUserIdRef.current !== userId) return;
      if (foldersRes.error) console.error('Failed to load folders:', foldersRes.error);
      if (bookmarksRes.error) console.error('Failed to load bookmarks:', bookmarksRes.error);
      setFolders([ALL_FOLDER, ...(foldersRes.data ?? [])]);
      setLinks((bookmarksRes.data ?? []).map(toLink));
      setIsLoading(false);
    };

    // 로그인 사용자가 바뀔 때마다 해당 사용자의 데이터를 다시 불러옴
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id ?? null;
      setUser(session ? { id: session.user.id, email: session.user.email ?? '' } : null);
      if (userId === loadedUserIdRef.current) return;
      loadedUserIdRef.current = userId;
      // 콜백 안에서 supabase 호출을 바로 await하면 교착될 수 있어 다음 틱으로 미룸
      setTimeout(() => loadUserData(userId), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const addLink = async (link: Omit<Link, 'id'>): Promise<Link> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        title: link.title,
        description: link.description,
        url: link.url,
        favicon: link.favicon ?? null,
        folder_id: link.folderId,
      })
      .select('id, title, description, url, favicon, folder_id')
      .single();
    if (error) throw error;
    const newLink = toLink(data);
    setLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) throw error;
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const addFolder = async (name: string, icon: string = '📁'): Promise<Folder> => {
    const { data, error } = await supabase
      .from('folders')
      .insert({ name, icon })
      .select('id, name, icon')
      .single();
    if (error) throw error;
    setFolders((prev) => [...prev, data]);
    return data;
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (error) throw error;
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    // DB에서 on delete cascade로 함께 삭제됨
    setLinks((prev) => prev.filter((link) => link.folderId !== id));
  };

  const editFolder = async (id: string, name: string) => {
    const { error } = await supabase.from('folders').update({ name }).eq('id', id);
    if (error) throw error;
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, name } : folder))
    );
  };

  return (
    <LinksContext.Provider
      value={{ user, signOut, links, folders, isLoading, addLink, deleteLink, addFolder, deleteFolder, editFolder }}
    >
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
