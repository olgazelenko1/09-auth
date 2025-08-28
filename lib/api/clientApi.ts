import { api } from "./api";
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

type CheckSessionRequest = {
  success: boolean;
};

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
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag !== "All" ? { tag } : {}),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await api.get<CheckSessionRequest>('/auth/session');
    return res.data?.success ?? false;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  try {
    const { data } = await api.get<User>('/users/me');
    return data;
  } catch {
    return null;
  }
};

export const updateProfile = async (data: UpdateProfile) => {
  const res = await api.patch<User>('/users/me', data, {
    withCredentials: true,
  });
  return res.data;
}