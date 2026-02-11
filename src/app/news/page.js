import Link from "next/link";
import NewsCard from "./newsCompo";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";

export default async function News() {

    const db = (await connectDB).db("weirdlab_news");
    const post = await db.collection("post").find().toArray();

    const cookieStore =await cookies();
    const hasToken = cookieStore.get('admin_token')?.value;

    console.log(post);

    return (
        <div>
            <h1>News</h1>
            <div>
            test 테스트
            <NewsCard newsData={JSON.parse(JSON.stringify(post))}/>

            {
              hasToken ? <Link href="/news/post">post</Link> : null
            }
          </div>
        </div>
    );
}