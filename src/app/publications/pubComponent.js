'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "../css/publication.module.css";
import TopBtn from "../components/icons/topBtn";

export default function PubCard({ pubData, hasToken }) {

  const router = useRouter();

  const sorted = pubData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let category = ["All Papers", "Journal Papers", "Conference Papers", "Others"]
  let [nowCategory, setNowCategory] = useState("All Papers");
  
  const filtered = nowCategory === "All Papers" ? sorted : sorted.filter(post => post.group === nowCategory.replace("\n", " "));

  return (
    <div className={styles.pub_container}>

      <div className={styles.pub_category_container}>
        {category.map((item, index) => (
          <div key={index} className={`${nowCategory === item ? 'main_color' : 'colorAAA'} ${styles.pub_category_item}`} onClick={() => setNowCategory(item)}>
            {item}
            <div className={
              nowCategory === item
                ? `main_color ${styles.pub_category_active}`
                : styles.pub_category_inactive}
            >{filtered.length}</div>
          </div>
        ))}

        {
          hasToken ? <Link href="/publications/post">post</Link> : null
        }

        <div className={styles.top_btn_container} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <TopBtn />
        </div>
      </div>

      <div className={styles.pub_card_container}>
        {filtered.length === 0 ? 
          <div className={styles.pub_card_none}>
            No publications found
          </div>
          : filtered.map((post) => (
          <div className={styles.pub_card} key={post._id} onClick={() => router.push(`/publications/${post._id}`)}>
            <div className={styles.pub_card_title}>{post.title}</div>
            <div className={styles.pub_card_entitle}>{post.enTitle}</div>
            <div className={styles.pub_card_info_container}>
              <div className={styles.pub_card_members}>{post.members}</div>
              <div className={styles.pub_card_category_date_container}>
                <div className={styles.pub_card_members}>{post.category}</div>
                <div>·</div>
                <div className={styles.pub_card_members}>{post.uploadDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}