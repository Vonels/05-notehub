// src/components/App/App.tsx
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

import { fetchNotes } from "../../services/noteService";
import type { FetchNotesParams, FetchNotesResponse } from "../../types/note";

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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryParams: FetchNotesParams = {
    page,
    perPage: PER_PAGE,
    search: debouncedSearch,
  };

  const { data, isLoading, isError, error, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", queryParams],
      queryFn: () => fetchNotes(queryParams),
      // 🔹 аналог старого keepPreviousData
      placeholderData: keepPreviousData,
    });

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

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {isFetching && !isLoading && <Loader />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
