'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>You must be logged in to leave a comment.</p>
        <Link href="/login" className="btn btn-primary">Log In</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId }),
      });

      if (res.ok) {
        setContent('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
      <h3 className="card-title" style={{ marginBottom: '1rem' }}>Leave a Comment</h3>
      <div className="input-group">
        <textarea
          className="input-field"
          rows={3}
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ resize: 'vertical' }}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary mt-2" disabled={loading || !content.trim()}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
