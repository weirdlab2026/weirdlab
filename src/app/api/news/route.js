import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { del } from '@vercel/blob';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.contents) {
      return NextResponse.json({ ok: false, error: "제목과 내용은 필수입니다." }, { status: 400 });
    }

    const db = (await connectDB).db("weirdlab_news");
    
    await db.collection("post").insertOne({
      title: body.title,
      contents: body.contents,
      source: body.source,
      images: body.images || [],
      createdAt: new Date(),    
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    const db = (await connectDB).db("weirdlab_news");
    const collection = db.collection("post");
    const targetId = new ObjectId(body.id);

    const post = await collection.findOne({ _id: targetId });

    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    if (post.images && post.images.length > 0) {
      await Promise.all(
        post.images.map((url) => del(url))
      );
    }

    await collection.deleteOne({ _id: targetId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id) {
        return NextResponse.json({ ok: false, error: "ID가 없습니다." }, { status: 400 });
    }

    const db = (await connectDB).db("weirdlab_news");
    const collection = db.collection("post");
    const targetId = new ObjectId(body.id);

    const oldPost = await collection.findOne({ _id: targetId });
    if (!oldPost) {
        return NextResponse.json({ ok: false, error: "게시글 없음" }, { status: 404 });
    }

    // (옛날 목록에는 있는데, 새로 들어온 목록에는 없는 URL 찾기)
    const oldImages = oldPost.images || []; // DB에 있던거
    const newImages = body.images || [];    // 프론트에서 보낸 최종본
    
    // '옛날거' 중에서 '새거'에 포함되지 않은 것들만 필터링 = 삭제된 이미지들
    const imagesToDelete = oldImages.filter(oldUrl => !newImages.includes(oldUrl));

    if (imagesToDelete.length > 0) {        
        // 병렬로 빠르게 삭제
        await Promise.all(
            imagesToDelete.map(url => del(url))
        );
    }

    await collection.updateOne(
      { _id: targetId },
      { $set: { 
          title: body.title, 
          contents: body.contents, 
          images: newImages 
        } 
      }
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}