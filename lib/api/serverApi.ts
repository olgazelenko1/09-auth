import axios from "axios";
import type { Note } from "../../types/note";
import { cookies } from 'next/headers';
import { api } from './api';


const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
});

export const fetchNotesServer = async (
  cookieHeader?: string,
  page?: number,
  perPage?: number,
  search?: string,
  tag?: string
) => {
  const response = await serverApi.get("/notes", {
    headers: {
      Cookie: cookieHeader || "",
    },
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "All" ? { tag } : {}),
    },
  });
  return response.data as { notes: Note[]; totalPages: number };
};

export const fetchNoteByIdServer = async (id: string, cookieHeader?: string) => {
  const response = await serverApi.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader || "",
    },
  });
  return response.data as Note;
};
export const checkServerSession = async () => {

  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {

      Cookie: cookieStore.toString(),
    },
  });

  return res;
};