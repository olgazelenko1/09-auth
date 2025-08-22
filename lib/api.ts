import axios from 'axios';
import type { Note, NewNoteData } from '../types/note';
import type { NoteTag } from '../types/note';

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNoteResponse {
  title: string;
  content: string;
  tag: NoteTag;
}
export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag !== 'All' ? { tag } : {}),
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, noteData, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};
export const getCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};
