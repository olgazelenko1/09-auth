import css from "./LayoutNotes.module.css";
import { Metadata } from "next";
type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};
export const metadata: Metadata ={
  title: 'Notes',
  description:'A list of all your notes',
  openGraph: {
    title: 'Notes',
    description: 'A list of all your notes',
    url: 'https://08-zustand-wheat.vercel.app/notes',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Notes Open Graph Image',
      },
    ],
  },
}
const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.notesWrapper}>{children}</main>
    </div>
  );
};

export default NotesLayout;