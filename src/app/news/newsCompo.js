'use client'

import { useRouter } from "next/navigation";

export default function NewsCard({ newsData }) {

  const router = useRouter();

  const sorted = newsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      {sorted.map((post) => (
        <div key={post._id} onClick={() => router.push(`/news/${post._id}`)}>
          <h2>{post.title}</h2>
          <p>{post.contents}</p>
          {post.images && post.images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              {post.images.map((imgUrl, idx) => (
                <img 
                  key={idx} 
                  src={imgUrl} 
                  alt={`post-img-${idx}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}