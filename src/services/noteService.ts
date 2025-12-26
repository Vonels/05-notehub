import axios from "axios";
import type { FetchNotesParams, FetchNotesResponse, Note } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "" } = params;

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search: search || undefined },
  });

  return response.data;
};

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note["tag"];
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const response = await api.delete<{ id: string }>(`/notes/${id}`);
  return response.data;
};
// f
