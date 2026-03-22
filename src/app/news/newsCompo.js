'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../css/news.module.css";
import TopBtn from "../components/icons/topBtn";
import Link from "next/link";

export default function NewsCard({ newsData, hasToken }) {

  const router = useRouter();

  const sorted = newsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let category = ["All News", "Notice", "Event", "Activity", "Others"]
  let [nowCategory, setNowCategory] = useState("All News");
  
  const filtered = nowCategory === "All News" ? sorted : sorted.filter(post => post.group === nowCategory);

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
          hasToken ? <Link href="/news/post">post</Link> : null
        }

        <div className={styles.top_btn_container}>
          <TopBtn />
        </div>
      </div>

      <div className={styles.news_card_container}>
        {filtered.length === 0 ? 
          <div className={styles.news_card_none}>
            No news found
          </div>
          : filtered.map((post) => (
          <div className={styles.news_card} key={post._id} onClick={() => router.push(`/news/${post._id}`)}>
            <div className={styles.news_card_title}>{post.title}</div>
            <div className={styles.news_card_entitle}>{post.enTitle}</div>

            <div className={styles.news_card_img_container}>
            {post.images.length > 0 ? (
              post.images.map((img, index) => (
                index < 4 ? (
                    <img src={img} key={index}/>
                ) : null
              ))
            ) : null}
            </div>

            <div className={styles.news_card_date}>{post.uploadDate}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
}