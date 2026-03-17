'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../css/project.module.css";

export default function ProCard({ pubData }) {

  const router = useRouter();

  const sorted = pubData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let category = ["All Projects", "Industry–Academia Collaboration", "Awards", "Others"]
  let [nowCategory, setNowCategory] = useState("All Projects");

  return (
    <div className={styles.pro_container}>

      <div className={styles.category_container}>
        {category.map((item, index) => (
          <div key={index} className={styles.category_item} onClick={() => setNowCategory(item)}>
            {item}
          </div>
        ))}
      </div>

      <div>
        {sorted.map((post) => (
          <div key={post._id} onClick={() => router.push(`/projects/${post._id}`)}>
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

      
    </div>
  );
}