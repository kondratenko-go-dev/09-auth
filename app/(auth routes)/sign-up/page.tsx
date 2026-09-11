'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';

import { register } from '@/lib/api/clientApi';
import type { AuthRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './SignUp.module.css';

const SignUp = () => {
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      setError('');

      const values = Object.fromEntries(formData) as unknown as AuthRequest;
      const user = await register(values);

      if (user) {
        setUser(user);
        router.push('/profile');
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error ?? 'Registration failed');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignUp;