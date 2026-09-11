import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';
const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}` },
});
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}
interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}
export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
      tag,
    },
  });

  return response.data;
};
export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};
export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
};
