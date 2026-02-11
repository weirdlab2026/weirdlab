import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '로그아웃 성공' });

  response.cookies.set('admin_token', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}