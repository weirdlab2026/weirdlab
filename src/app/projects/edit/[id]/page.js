import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import EditForm from "./proEdit";
import Link from "next/link";

export default async function ProEditPage({ params }) {

  const { id } = await params;
  const db = (await connectDB).db("weirdlab_projects");
  const post = await db.collection("post").findOne({ _id: new ObjectId(id) });

  return (
    <div>
      <EditForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}