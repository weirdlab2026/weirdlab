import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { use } from "react";
import DeleteBtn from "@/app/components/deleteBtn";
import { cookies } from "next/headers";

export default async function NewsDetail({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_news");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  console.log(post);

  return (
    <div>
      <Link href="/news">뒤로가기</Link>
      <h1>{post.title}</h1>
      <p>{post.contents}</p>
      {post.images && post.images.length > 0 && (
        post.images.map((imgUrl, idx) => (
          <img key={idx} src={imgUrl} alt="" style={{ width: '300px', height: '300px', objectFit: 'cover', marginRight: '20px' }} />
        ))
      )}
      <div>
        {token ? <Link href={`/news/edit/${post._id.toString()}`}>수정</Link> : null}
        {token ? <DeleteBtn id={post._id.toString()} url={"/api/news"} /> : null}
      </div>
    </div>
  );
}