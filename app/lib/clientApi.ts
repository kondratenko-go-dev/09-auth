import { nextServer } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

// ---------- Notes ----------

export interface FetchNotesParams {
  page?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

const PER_PAGE = 12;

export const fetchNotes = async ({
  page = 1,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: PER_PAGE,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${noteId}`);
  return response.data;
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

// ---------- Auth ----------

export interface AuthRequest {
  email: string;
  password: string;
}

export const register = async (payload: AuthRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/register', payload);
  return response.data;
};

export const login = async (payload: AuthRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/login', payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

interface CheckSessionResponse {
  success: boolean;
}

export const checkSession = async (): Promise<boolean> => {
  const response = await nextServer.get<CheckSessionResponse>('/auth/session');
  return response.data.success;
};

// ---------- User ----------

export interface UpdateMeRequest {
  username: string;
}

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (payload: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>('/users/me', payload);
  return response.data;
};
