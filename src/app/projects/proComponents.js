'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../css/project.module.css";
import Link from "next/link";
import TopBtn from "../components/icons/topBtn";

export default function ProCard({ pubData, hasToken }) {

  const router = useRouter();

  const sorted = pubData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let category = ["All Projects", "Industry–Academia\nCollaboration", "Awards", "Others"]
  let [nowCategory, setNowCategory] = useState("All Projects");

  const filtered = nowCategory === "All Projects" ? sorted : sorted.filter(post => post.group === nowCategory.replace("\n", " "));


  return (
    <div className={styles.pro_container}>

      <div className={styles.category_container}>
        {category.map((item, index) => (
          <div key={index} className={`${nowCategory === item ? 'main_color' : 'colorAAA'} ${styles.category_item}`} onClick={() => setNowCategory(item)}>
            {item}
            <div className={
              nowCategory === item
                ? `main_color ${styles.category_active}`
                : styles.category_inactive}
            >{filtered.length}</div>
          </div>
        ))}

        {
          hasToken ? <Link href="/projects/post">post</Link> : null
        }

        <div className={styles.top_btn_container} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <TopBtn />
        </div>
      </div>

      <div className={styles.pro_card_container}>
        
        {filtered.length === 0 ? 
          <div className={styles.pro_card_none}>
            No projects found
          </div>
         : 
          filtered.map((post, index) => {
          const pattern = index % 3;

          // 👉 2번째(index 2, 5, 8...)는 full
          if (pattern === 0) {
            return (
              <div 
                key={post._id}
                className={styles.pro_card_0}
                onClick={() => router.push(`/projects/${post._id}`)}
              >
                <div className={styles.pro_img_container}>
                  <img src={post.images?.[0]} />
                </div>

                <div className={styles.pro_text_container}>
                  <div className={styles.pro_title}>{post.title}</div>
                  <div className={styles.pro_text_category}>{post.category}</div>
                </div>
              </div>
            );
          }

          if (pattern === 1) {
            return (
              <div 
                key={post._id}
                className={styles.pro_card_1}
                onClick={() => router.push(`/projects/${post._id}`)}
              >
                <div className={styles.pro_img_container}>
                  <img src={post.images?.[0]} />
                </div>

                <div className={styles.pro_text_container}>
                  <div className={styles.pro_title}>{post.title}</div>
                  <div className={styles.pro_text_category}>{post.category}</div>
                </div>
              </div>
            );
          }

          if (pattern === 2) {
            return (
              <div 
                key={post._id}
                className={styles.pro_card_2}
                onClick={() => router.push(`/projects/${post._id}`)}
              >
                <div className={styles.pro_img_container}>
                  <img src={post.images?.[0]} />
                </div>

                <div className={styles.pro_text_container}>
                  <div className={styles.pro_title}>{post.title}</div>
                  <div className={styles.pro_text_category}>{post.category}</div>
                </div>
              </div>
            );
          }

        })}
      </div>

      
    </div>
  );
}