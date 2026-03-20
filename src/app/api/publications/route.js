import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { del } from "@vercel/blob";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.contents) {
      return NextResponse.json(
        { ok: false, error: "제목과 내용은 필수입니다." },
        { status: 400 }
      );
    }

    const db = (await connectDB).db("weirdlab_publications");

    await db.collection("post").insertOne({
      title: body.title,
      enTitle: body.enTitle,
      contents: body.contents,
      group: body.group,
      category: body.category,
      uploadDate: body.uploadDate,
      members: body.members,
      source: body.source,
      file: body.file || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { ok: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const db = (await connectDB).db("weirdlab_publications");
    const collection = db.collection("post");
    const targetId = new ObjectId(body.id);

    const post = await collection.findOne({ _id: targetId });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // ✅ 파일 있으면 Blob 삭제
    if (post.file) {
      try {
        await del(post.file);
      } catch (e) {
        console.error("Blob 삭제 실패:", e);
      }
    }

    await collection.deleteOne({ _id: targetId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { ok: false, error: "ID가 없습니다." },
        { status: 400 }
      );
    }

    const db = (await connectDB).db("weirdlab_publications");
    const collection = db.collection("post");
    const targetId = new ObjectId(body.id);

    const oldPost = await collection.findOne({ _id: targetId });

    if (!oldPost) {
      return NextResponse.json(
        { ok: false, error: "게시글 없음" },
        { status: 404 }
      );
    }

    // ✅ 기존 파일과 새 파일 비교
    const oldFile = oldPost.file || null;
    const newFile = body.file || null;

    // ✅ 파일이 바뀌었으면 옛 파일 삭제
    if (oldFile && oldFile !== newFile) {
      try {
        await del(oldFile);
      } catch (e) {
        console.error("기존 파일 삭제 실패:", e);
      }
    }

    await collection.updateOne(
      { _id: targetId },
      {
        $set: {
          title: body.title,
          enTitle: body.enTitle,
          contents: body.contents,
          group: body.group,
          category: body.category,
          uploadDate: body.uploadDate,
          members: body.members,
          source: body.source,
          file: newFile,
        },
      }
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
