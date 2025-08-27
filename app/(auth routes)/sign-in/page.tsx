'use client';

import css from "./SignInPage.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { ApiError } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';

const SignIn = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
     
      const formData = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
      const formValues: LoginRequest = { email: formData.email, password: formData.password };

      const user = await login(formValues);

      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(
        (err as ApiError).response?.data?.error ??
        (err as ApiError).message ??
        'Oops... some error'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Log in</button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignIn;