import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Discover Amazing Stories
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
          A platform to share your thoughts, read great articles, and connect.
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280' }}>No posts yet. Be the first to create one!</div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {posts.map((post) => (
            <div key={post.id} className="card">
              <h2 className="card-title">{post.title}</h2>
              <div className="card-meta">
                By {post.author.name || post.author.email} • {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <p style={{ color: 'var(--text)', opacity: 0.8 }}>
                {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
              </p>
              <div className="mt-4">
                <Link href={`/post/${post.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
