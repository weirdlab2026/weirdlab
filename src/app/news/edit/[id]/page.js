import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import EditForm from "./editForm";
import Link from "next/link";

export default async function NewsDetail({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_news");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  return (
    <div>
      <Link href={`/news/${post._id.toString()}`}>뒤로가기</Link>
      <EditForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}