import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import type { CreateNotePayload } from "../../services/noteService";

const TAG_OPTIONS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Maximum 500 characters").required("Required"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(TAG_OPTIONS, "Invalid tag")
    .required("Required"),
});

interface NoteFormProps {
  onSubmit: (values: CreateNotePayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteForm = ({ onSubmit, onCancel, isSubmitting }: NoteFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <FormikError
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
