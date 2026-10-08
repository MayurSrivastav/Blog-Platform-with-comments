'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '4rem' }}>
      <div className="card">
        <h1 className="text-center" style={{ marginBottom: '1.5rem' }}>Sign Up</h1>
        {error && <p className="text-error text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input type="email" id="email" name="email" className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="input-field" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
