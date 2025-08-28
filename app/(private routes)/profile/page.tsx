import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import { fetchCurrentUserServer } from '@/lib/api/serverApi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile page',
  openGraph: {
      title: 'Create Note',
      description: 'Create a new note',
      url:'https://08-zustand-wheat.vercel.app/notes/action/create',
      type: 'website',
        images: [
            {
            url:'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'Create Note',
            },
        ],
      }
};

export default async function ProfilePage() {
  const user = await fetchCurrentUserServer();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p className={css.message}>User not found.</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit
          </Link>
        </div>

        <Image
          src={user.avatar || '/avatar-placeholder.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <div className={css.profileInfo}>
          <p className={css.username}><strong>Username:</strong> {user.username}</p>
          <p className={css.email}><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </main>
  );
}
