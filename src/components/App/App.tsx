import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { FetchNotesParams } from "../../types/note";
import type { FetchNotesResponse } from "../../types/note";
import type { CreateNotePayload } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const PER_PAGE = 12;

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const queryParams: FetchNotesParams = {
    page,
    perPage: PER_PAGE,
    search: debouncedSearch,
  };

  const { data, isLoading, isError, error, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", queryParams],
      queryFn: () => fetchNotes(queryParams),
    });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (values: CreateNotePayload) => {
    createMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onChangePage={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {isFetching && !isLoading && <Loader />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            isSubmitting={createMutation.isPending}
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
