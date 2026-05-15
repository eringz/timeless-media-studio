'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      document.cookie = 'adminAuthenticated=true; path=/; max-age=86400; SameSite=Lax';
      router.push('/admin');
      return;
    }

    setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 pt-28 text-white">
      <div className="bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl">
        <h1 className="text-3xl font-black text-center mb-6">Admin Login</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-white/10 rounded-xl w-full py-3 px-4 text-black outline-none focus:ring-4 focus:ring-white/20"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-white/10 rounded-xl w-full py-3 px-4 text-black outline-none focus:ring-4 focus:ring-white/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-white py-3 font-black text-black transition hover:scale-[1.02] active:scale-[0.97]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
