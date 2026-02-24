export const revalidate = 600;

import Link from "next/link";
import PubCard from "./pubComponent";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";

export default async function Publication() {

  const db = (await connectDB).db("weirdlab_publications");
  const post = await db.collection("post").find().toArray();

  const cookieStore =await cookies();
  const hasToken = cookieStore.get('admin_token')?.value;

  console.log(post);

  return (
      <div>
          <h1>Publication</h1>
          <div>
          test 테스트
          <PubCard pubData={JSON.parse(JSON.stringify(post))}/>

          {
            hasToken ? <Link href="/publications/post">post</Link> : null
          }
        </div>
      </div>
    );
}