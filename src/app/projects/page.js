export const revalidate = 600;

import Link from "next/link";
import ProCard from "./proComponents";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";

export default async function Project() {

  const db = (await connectDB).db("weirdlab_projects");
  const post = await db.collection("post").find().toArray();

  const cookieStore =await cookies();
  const hasToken = cookieStore.get('admin_token')?.value;

  console.log(post);

  return (
      <div>
          <h1>Project</h1>
          <div>
          test 테스트
          <ProCard pubData={JSON.parse(JSON.stringify(post))}/>

          {
            hasToken ? <Link href="/projects/post">post</Link> : null
          }
        </div>
      </div>
    );
}