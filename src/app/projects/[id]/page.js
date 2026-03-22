import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { use } from "react";
import DeleteBtn from "@/app/components/deleteBtn";
import { cookies } from "next/headers";
import styles from "@/app/css/projectDetail.module.css";
import TopBtn from '@/app/components/icons/topBtn';

export default async function ProDetail({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_projects");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  console.log(post);

  return (
    <div className={styles.pro_detail_container}>

      <Link href="/projects" className={styles.back_container}>
        <div className={styles.back_btn_container}><TopBtn /></div>
        <div className={`${styles.back_text} main_color`}>Back</div>
      </Link>

      <div className={styles.pro_decs_container}>
        <div className={styles.pro_title}>{post.title}</div>
        <div className={styles.pro_en_title}>{post.enTitle}</div>
        <div className={styles.pro_contents}>{post.contents}</div>
        
        <div className={styles.pro_info_container}>
          <div>
            <div className={styles.pro_info_title}>Group</div>
            <div className={styles.pro_info_desc}>
              {post.group.replace(' ', '\n')}
            </div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Category</div>
            <div className={styles.pro_info_desc}>{post.category}</div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Date</div>
            <div className={styles.pro_info_desc}>{post.uploadDate}</div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Members</div>
            <div className={styles.pro_info_desc}>{post.members}</div>
          </div>
        </div>

        <div className={styles.pro_detail_img_container}>
        {post.images && post.images.length > 0 && (
          post.images.map((imgUrl, idx) => (
            <img key={idx} src={imgUrl} className={styles.pro_detail_img} />
          ))
        )}
        </div>

        <div>
          {token ? <Link href={`/projects/edit/${post._id.toString()}`}>수정</Link> : null}
          {token ? <DeleteBtn id={post._id.toString()} url={"/api/projects"} /> : null}
        </div>
      </div>

      
    </div>
  );
}