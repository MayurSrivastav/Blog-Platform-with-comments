'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Since we don't have a GET /api/posts/[id], we'll fetch from a new endpoint or just use Server component wrapper.
        // Actually, we can just fetch via a generic API if we had one.
        // For simplicity in a client component, I'll fetch the post via a quick call.
        const res = await fetch(`/api/posts/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError('Failed to load post');
        }
      } catch (err) {
        setError('Failed to load post');
      }
    };
    fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/post/${params.id}`);
        router.refresh();
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

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem' }}>Edit Post</h1>
        {error && <p className="text-error mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="title">Title</label>
            <input type="text" id="title" name="title" className="input-field" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="content">Content</label>
            <textarea 
              id="content" 
              name="content" 
              className="input-field" 
              required 
              rows={10} 
              style={{ resize: 'vertical' }}
              value={content} 
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-4" disabled={loading || !title}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
