'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes');
    },
    onError: (error) => {
      console.error('Note creation failed:', error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as {
      title: string;
      content: string;
      tag: NoteTag;
    };
    mutation.mutate(values);
  };

  const handleCancel = () => router.back();

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={draft.title}
          onChange={handleChange}
          required
          className={css.input}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          defaultValue={draft.content}
          onChange={handleChange}
          required
          className={css.textarea}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag">Tag</label>
        <select
          name="tag"
          defaultValue={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Meeting">Meeting</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" disabled={mutation.isPending} className={css.submitButton}>
          {mutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
      </div>

      {mutation.isError && (
        <p className={css.error}>
          Error: {(mutation.error as Error)?.message ?? 'Something went wrong'}
        </p>
      )}
    </form>
  );
};

export default NoteForm;
