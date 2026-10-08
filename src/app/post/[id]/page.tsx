import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CommentForm from '@/app/components/CommentForm';
import PostActions from '@/app/components/PostActions';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <article className="card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{post.title}</h1>
        <div className="card-meta" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>By <span style={{ fontWeight: 600, color: 'var(--text)' }}>{post.author.name || post.author.email}</span> on {new Date(post.createdAt).toLocaleDateString()}</div>
          <PostActions post={post} />
        </div>
        
        <div style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </article>

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Comments <span style={{ backgroundColor: 'var(--surface)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '1rem' }}>{post.comments.length}</span>
        </h2>
        
        {post.comments.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No comments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {post.comments.map((comment) => (
              <div key={comment.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{comment.author.name || comment.author.email}</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
        
        <CommentForm postId={post.id} />
      </div>
    </div>
  );
}
