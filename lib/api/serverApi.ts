import type { Note } from '@/types/note';
import { cookies } from 'next/headers';
import { api } from './api';



export const fetchNotesServer = async (
  page?: number,
  perPage?: number,
  search?: string,
  tag?: string
) => {
  const cookieStore = cookies();
  const response = await api.get('/notes', {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== 'All' ? { tag } : {}),
    },
  });
  return response.data as { notes: Note[]; totalPages: number };
};

export const fetchNoteByIdServer = async (id: string) => {
  const cookieStore = cookies();
  const response = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data as Note;
};
export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const fetchCurrentUserServer = async () => {
  const cookieStore = cookies();
  const res = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};