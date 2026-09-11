import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

const PER_PAGE = 12;

export const fetchNotes = async ({
  page = 1,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: PER_PAGE,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const response = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
