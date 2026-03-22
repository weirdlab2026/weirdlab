import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import DeleteBtn from "@/app/components/deleteBtn";
import { cookies } from "next/headers";
import styles from "@/app/css/projectDetail.module.css";
import TopBtn from "@/app/components/icons/topBtn";
import Download from "@/app/components/icons/download";

export default async function ProDetail({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_publications");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  return (
    <div className={styles.pro_detail_container}>

      <Link href="/publications" className={styles.back_container}>
        <div className={styles.back_btn_container}><TopBtn /></div>
        <div className={`${styles.back_text} main_color`}>Back</div>
      </Link>

      <div className={styles.pro_decs_container}>
        <div className={styles.pro_title}>{post.title}</div>
        <div className={styles.pro_en_title}>{post.enTitle}</div>

        {post.file && (
          <div className={styles.pdf_download_container}>
            <a href={`/api/download?url=${encodeURIComponent(post.file)}&name=${encodeURIComponent(post.title)}.pdf`}>
              <div className={styles.pdf_download_text_container}>
                <Download />
                <div className={styles.pdf_download_btn}>논문 다운로드</div>
              </div>
            </a>
          </div>
        )}
        
        <div className={styles.pro_info_container}>
          <div>
            <div className={styles.pro_info_title}>Group</div>
            <div className={styles.pro_info_desc}>
              {post.group}
            </div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Society</div>
            <div className={styles.pro_info_desc}>{post.category}</div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Date</div>
            <div className={styles.pro_info_desc}>{post.uploadDate}</div>
          </div>
          <div>
            <div className={styles.pro_info_title}>Authors</div>
            <div className={styles.pro_info_desc}>{post.members}</div>
          </div>
        </div>

        <div className={styles.pro_contents} style={{color:"#555"}}>{post.contents}</div>

        <div>
          {token ? <Link href={`/publications/edit/${post._id.toString()}`}>수정</Link> : null}
          {token ? <DeleteBtn id={post._id.toString()} url={"/api/publications"} /> : null}
        </div>

      </div>
    </div>
  );
}