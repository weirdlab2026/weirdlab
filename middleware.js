import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. [중요] 로그인 API는 검사에서 제외 (이게 없으면 로그인 불가능)
  // 본인의 로그인 API 주소와 정확히 일치해야 합니다.
  if (pathname === '/api/login') {
    return NextResponse.next();
  }

  // 2. 쿠키에서 토큰 확인
  const token = request.cookies.get('admin_token')?.value;

  // 인증 실패 시 메인으로 리다이렉트
  const redirectToHome = NextResponse.redirect(new URL('/', request.url));

  // 3. 토큰 없으면 튕기기
  if (!token) {
    // API 요청일 때 리다이렉트 대신 401 에러를 주는 게 더 좋을 수도 있습니다.
    // (프론트에서 JSON 에러 처리를 하기 위함)
    // return NextResponse.json({ message: '인증 필요' }, { status: 401 }); 
    
    return redirectToHome; 
  }

  try {
    // 4. 토큰 검증
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    return NextResponse.next();

  } catch (error) {
    console.error('인증 실패:', error);
    return redirectToHome;
  }
}

export const config = {
  // ★ API 경로만 감시하도록 설정
  matcher: '/api/:path*',
};