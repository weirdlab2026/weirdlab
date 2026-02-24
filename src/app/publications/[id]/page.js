import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import DeleteBtn from "@/app/components/deleteBtn";
import { cookies } from "next/headers";

export default async function ProDetail({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_publications");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  return (
    <div>
      <Link href="/publications">뒤로가기</Link>

      <h1>{post.title}</h1>
      <p>{post.contents}</p>

      {post.file && (
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <a 
            href={`/api/download?url=${encodeURIComponent(post.file)}&name=${encodeURIComponent(post.title)}.pdf`}
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            📄 PDF 다운로드
          </a>
        </div>
      )}

      <div>
        {token ? <Link href={`/publications/edit/${post._id.toString()}`}>수정</Link> : null}
        {token ? <DeleteBtn id={post._id.toString()} url={"/api/publications"} /> : null}
      </div>
    </div>
  );
}