import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { del } from '@vercel/blob';

export async function POST(req) {
  try {
    const body = await req.json();

    const db = (await connectDB).db("weirdlab_people"); 
    const collection = db.collection("people");

    const oldProfile = await collection.findOne({});

    if (oldProfile) {
      const oldPhdPhotos = (oldProfile.phdStudents || []).map(s => s.photoUrl).filter(Boolean);
      const oldMasterPhotos = (oldProfile.masterStudents || []).map(s => s.photoUrl).filter(Boolean);
      const oldImages = [...oldPhdPhotos, ...oldMasterPhotos];
      const newPhdPhotos = (body.phdStudents || []).map(s => s.photoUrl).filter(Boolean);
      const newMasterPhotos = (body.masterStudents || []).map(s => s.photoUrl).filter(Boolean);
      const newImages = [...newPhdPhotos, ...newMasterPhotos];

      const imagesToDelete = oldImages.filter(oldUrl => !newImages.includes(oldUrl));

      if (imagesToDelete.length > 0) {        
        await Promise.all(
          imagesToDelete.map(url => del(url))
        );
      }

      // 5. 남은 정보를 DB에 덮어쓰기 (업데이트)
      await collection.updateOne(
        { _id: oldProfile._id },
        { $set: body }
      );
    } else {
      // 문서가 아예 없는 초기 상태라면 새로 생성
      await collection.insertOne({
        ...body,
        createdAt: new Date(),
      });
    }

    // 성공 응답 포맷을 참고하신 코드와 통일({ ok: true })
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}