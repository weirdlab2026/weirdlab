import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const client = await clientPromise;
    const db = client.db('a2flab_admin');

    const adminUser = await db.collection('admins').findOne({});

    if (!adminUser) {
      return NextResponse.json({ message: '관리자 계정 없음' }, { status: 404 });
    }

    // console.log("--- 디버깅 ---");
    // console.log("입력한 비번:", password);
    // console.log("DB 해시값:", adminUser.password);
    
    // 3. 비밀번호 검증
    const isValid = await bcrypt.compare(password, adminUser.password);
    //console.log("일치 여부:", isValid);

    if (!isValid) {
      return NextResponse.json({ message: '비밀번호를 다시 확인해주세요.' }, { status: 401 });
    }

    const token = jwt.sign(
      { role: 'admin' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: '로그인 성공' }, { status: 200 });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: false, // 개발환경에선 false 처리
      sameSite: 'lax', // strict는 개발환경에서 가끔 쿠키 저장 막힘
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: '서버 에러', error: error.message }, { status: 500 });
  }
}