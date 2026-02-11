import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// 1. 이미지 업로드 (프론트엔드에서 파일 선택 시 즉시 실행)
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const originalFilename = searchParams.get('filename'); // 사용자가 올린 원래 파일명

  if (!originalFilename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // 1. 확장자 추출 (예: jpg, png, pdf)
  const extension = originalFilename.split('.').pop();

  // 예시: uploads/1706512345678_xf3a2z.jpg
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 7);
  const uniqueFilename = `news_image/${timestamp}_${randomString}.${extension}`;

  // 3. Vercel Blob에 새로운 이름으로 저장
  const blob = await put(uniqueFilename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}

// 2. 이미지 개별 삭제 (글 작성 중 'X' 버튼 눌렀을 때 사용)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const blobUrl = searchParams.get('blobUrl');

  if (!blobUrl) {
    return NextResponse.json({ error: 'Blob URL is required' }, { status: 400 });
  }

  try {
    await del(blobUrl);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting blob:', error);
    return NextResponse.json({ error: 'Failed to delete blob' }, { status: 500 });
  }
}