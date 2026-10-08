'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostActions({ post }: { post: { id: string; authorId: string, author: { email: string | null } } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!session || !session.user || session.user.email !== post.author.email) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <Link href={`/edit-post/${post.id}`} className="btn btn-outline">
        Edit
      </Link>
      <button 
        onClick={handleDelete} 
        className="btn btn-outline" 
        style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
