'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <nav className="nav-links">Loading...</nav>;
  }

  return (
    <nav className="nav-links">
      <Link href="/" className="btn btn-outline" style={{ border: 'none' }}>Home</Link>
      {session ? (
        <>
          <span style={{ marginRight: '1rem', color: 'var(--text)', opacity: 0.8 }}>
            Hi, {session.user?.name || session.user?.email}
          </span>
          <Link href="/create-post" className="btn btn-outline">Create Post</Link>
          <button className="btn btn-outline" onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <Link href="/login" className="btn btn-outline">Log in</Link>
          <Link href="/register" className="btn btn-primary">Sign up</Link>
        </>
      )}
    </nav>
  );
}
