// client-side helpers use same-origin fetch; server axios instance not needed here
import type { Note, NewNoteData } from "@/types/note";
import { User } from '@/types/user';


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}

/* CheckSessionRequest removed: client uses fetch and expects { success: boolean } response */

export type UpdateProfile = {
  username?: string;
  email?: string;
  avatar?: string;
};


export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    ...(search.trim() ? { search } : {}),
    ...(tag && tag !== "All" ? { tag } : {}),
  });
  const res = await fetch(`/api/notes?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return (await res.json()) as FetchNotesResponse;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await fetch(`/api/notes/${encodeURIComponent(id)}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch note');
  return (await res.json()) as Note;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await fetch('/api/notes', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return (await res.json()) as Note;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return (await res.json()) as Note;
};

export const register = async (data: RegisterRequest) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return (await res.json()) as User;
};

export const login = async (data: LoginRequest) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return (await res.json()) as User;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (!res.ok) return false;
    const json = await res.json();
    return json?.success ?? false;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
};

export const getMe = async () => {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
};

export const updateProfile = async (data: UpdateProfile) => {
  const res = await fetch('/api/users/me', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update profile failed');
  return (await res.json()) as User;
}